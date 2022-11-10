type DeepRequired<T> = {
  [K in keyof T]: Required<DeepRequired<T[K]>>
}

interface AnyJSON {
  [key: string]: any
}
