export const debounce = (
  callback: (...args: any[]) => void,
  wait: number = 50
) => {
  let timeoutId: number | undefined
  let latestArgs: any[] | undefined

  return (...args: any[]) => {
    latestArgs = args

    if (!timeoutId) {
      timeoutId = window.setTimeout(async () => {
        await callback.apply(null, latestArgs as [])

        timeoutId = undefined
      }, wait)
    }
  }
}
