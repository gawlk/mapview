// ---
// JSON
// ---

type JSONMinidynProjectVAny = JSONMinidynProject

interface JSONMinidynProject {
  version: 1
  base: JSONBaseProject
  distinct: JSONMinidynProjectDistinct
}

interface JSONMinidynProjectDistinct {
  version: 1
  units: JSONMinidynUnits
  bearingParameters: JSONBearingParameters
}

// ---
// Object
// ---

interface MinidynProject extends BaseProject {
  readonly machine: 'Minidyn'
  readonly reports: SelectableList<MinidynReport>
  readonly units: MinidynMathUnits
  readonly information: Field[]
  readonly hardware: Field[]
  bearingParameters: JSONBearingParameters
  toJSON: () => JSONMinidynProject
}
