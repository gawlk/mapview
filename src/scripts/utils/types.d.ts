type DeepRequired<T> = {
  [K in keyof T]: Required<DeepRequired<T[K]>>
}

interface AnyJSON {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}
