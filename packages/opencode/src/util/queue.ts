export class AsyncQueue<T> implements AsyncIterable<T> {
  private queue: T[] = []
  private offset = 0
  private resolvers: ((value: T) => void)[] = []

  push(item: T) {
    const resolve = this.resolvers.shift()
    if (resolve) resolve(item)
    else this.queue.push(item)
  }

  async next(): Promise<T> {
    if (this.offset < this.queue.length) {
      const item = this.queue[this.offset]!
      this.offset += 1
      if (this.offset === this.queue.length) {
        this.queue = []
        this.offset = 0
      }
      return item
    }
    return new Promise((resolve) => this.resolvers.push(resolve))
  }

  async *[Symbol.asyncIterator]() {
    while (true) yield await this.next()
  }
}

export async function work<T>(concurrency: number, items: T[], fn: (item: T) => Promise<void>) {
  const pending = [...items]
  let index = 0
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (true) {
        const item = pending[index]
        index += 1
        if (item === undefined) return
        await fn(item)
      }
    }),
  )
}
