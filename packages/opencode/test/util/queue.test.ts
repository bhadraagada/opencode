import { describe, expect, test } from "bun:test"
import { AsyncQueue, work } from "../../src/util/queue"

describe("util.queue", () => {
  test("AsyncQueue should preserve FIFO order", async () => {
    const queue = new AsyncQueue<number>()
    queue.push(1)
    queue.push(2)
    queue.push(3)

    expect(await queue.next()).toBe(1)
    expect(await queue.next()).toBe(2)
    expect(await queue.next()).toBe(3)
  })

  test("AsyncQueue should resolve waiting consumer", async () => {
    const queue = new AsyncQueue<string>()
    const next = queue.next()
    queue.push("ok")
    expect(await next).toBe("ok")
  })

  test("work should process items in input order when concurrency is one", async () => {
    const items = [1, 2, 3, 4]
    const visited: number[] = []

    await work(1, items, async (item) => {
      visited.push(item)
    })

    expect(visited).toEqual([1, 2, 3, 4])
  })
})
