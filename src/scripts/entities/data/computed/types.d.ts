interface MathNumberObject {
  [key: string]: MathNumber | MathNumber[] | MathNumber[][]
}

interface ComputedData {
  raw: MathNumberObject
  parameters: MathNumberObject
  computed: MathNumberObject
  compute: () => void
}
