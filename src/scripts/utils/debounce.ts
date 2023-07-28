/* eslint-disable @typescript-eslint/no-explicit-any */
export const debounce = (callback: (...args: any[]) => void, wait = 250) => {
  let timeoutId: number | undefined
  let latestArgs: any[] | undefined

  return (...args: any[]) => {
    latestArgs = args

    if (!timeoutId) {
      timeoutId = window.setTimeout(async () => {
        // Needed because the function passed to the debounced can either be sync or async
        // eslint-disable-next-line @typescript-eslint/await-thenable
        await callback(...(latestArgs || []))

        timeoutId = undefined
      }, wait)
    }
  }
}
