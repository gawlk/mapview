interface MathNumberObject {
  readonly [key: string]: MathNumber | MathNumber[] | MathNumber[][]
}

interface ComputedData {
  readonly raw: MathNumberObject
  readonly parameters: MathNumberObject
  readonly computed: MathNumberObject
  readonly compute: () => void
}
