type DebouncedFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): Promise<ReturnType<T>>
  cancel: () => void
}

export default function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): DebouncedFunction<T> {
  let timeoutId: NodeJS.Timeout | undefined
  let currentPromise: Promise<any> | undefined
  let isCancelled = false

  const debouncedFn = (...args: Parameters<T>): Promise<ReturnType<T>> => {
    // 重置取消狀態
    isCancelled = false

    // 清除之前的計時器
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(() => {
        if (isCancelled) {
          reject(new Error("Cancelled"))
          return
        }

        try {
          currentPromise = Promise.resolve(fn(...args))
          currentPromise.then(resolve).catch(reject)
        } catch (err) {
          reject(err)
        }
      }, delay)
    })
  }

  debouncedFn.cancel = () => {
    isCancelled = true
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = undefined
    }
  }

  return debouncedFn
}
