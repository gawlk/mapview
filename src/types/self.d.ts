type DeepRequired<T> = {
  [K in keyof T]: Required<DeepRequired<T[K]>>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RecordAny = Record<string, any>
type JSONAny = RecordAny

type JSONValue = string | number | boolean | null
type JSONArray = (JSONValue | JSONObject)[]
type JSONObject<T = JSONValue | JSONArray> = Record<string, T>
