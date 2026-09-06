import { Hono, type Context } from "hono"
import { describeRoute, resolver, validator } from "hono-openapi"
import { z } from "zod"
import { Instance } from "../project/instance"
import { AsyncQueue } from "../util/queue"
import { ulid } from "ulid"

const TuiRequest = z.object({
  requestID: z.string(),
  path: z.string(),
  body: z.any(),
})

type TuiRequest = z.infer<typeof TuiRequest>

const state = Instance.state(
  () => ({
    request: new AsyncQueue<TuiRequest>(),
    pending: new Map<
      string,
      {
        resolve: (value: any) => void
        reject: (error: Error) => void
      }
    >(),
  }),
  async (current) => {
    for (const pending of current.pending.values()) {
      pending.reject(new Error("TUI control was disposed"))
    }
    current.pending.clear()
  },
)

function responseBody(input: any) {
  if (typeof input !== "object" || input === null) return input
  if ("body" in input) return input.body
  if ("response" in input) return input.response
  return input
}

function responseID(input: any) {
  if (typeof input !== "object" || input === null) return
  if (!("requestID" in input)) return
  if (typeof input.requestID !== "string") return
  return input.requestID
}

export async function callTui(ctx: Context) {
  const s = state()
  const body = await ctx.req.json()
  const requestID = ulid()
  const signal = ctx.req.raw.signal
  let cleanup = () => {}
  const result = new Promise((resolve, reject) => {
    s.pending.set(requestID, { resolve, reject })
    if (signal.aborted) {
      s.pending.delete(requestID)
      reject(new Error("Request aborted"))
      return
    }
    const onAbort = () => {
      const pending = s.pending.get(requestID)
      if (!pending) return
      s.pending.delete(requestID)
      pending.reject(new Error("Request aborted"))
    }
    signal.addEventListener("abort", onAbort, { once: true })
    cleanup = () => signal.removeEventListener("abort", onAbort)
  })

  s.request.push({
    requestID,
    path: ctx.req.path,
    body,
  })
  return result.finally(cleanup)
}

export const TuiRoute = new Hono()
  .get(
    "/next",
    describeRoute({
      summary: "Get next TUI request",
      description: "Retrieve the next TUI (Terminal User Interface) request from the queue for processing.",
      operationId: "tui.control.next",
      responses: {
        200: {
          description: "Next TUI request",
          content: {
            "application/json": {
              schema: resolver(TuiRequest),
            },
          },
        },
      },
    }),
    async (c) => {
      const req = await state().request.next()
      return c.json(req)
    },
  )
  .post(
    "/response",
    describeRoute({
      summary: "Submit TUI response",
      description: "Submit a response to the TUI request queue to complete a pending request.",
      operationId: "tui.control.response",
      responses: {
        200: {
          description: "Response submitted successfully",
          content: {
            "application/json": {
              schema: resolver(z.boolean()),
            },
          },
        },
      },
    }),
    validator("json", z.any()),
    async (c) => {
      const body = c.req.valid("json")
      const s = state()
      const id = responseID(body)
      if (id) {
        const pending = s.pending.get(id)
        if (!pending) return c.json(false)
        s.pending.delete(id)
        pending.resolve(responseBody(body))
        return c.json(true)
      }

      const first = s.pending.entries().next()
      if (first.done) return c.json(false)
      s.pending.delete(first.value[0])
      first.value[1].resolve(body)
      return c.json(true)
    },
  )
