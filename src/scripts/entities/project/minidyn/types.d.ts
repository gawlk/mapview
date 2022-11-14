// ---
// JSON
// ---

type JSONMinidynProjectVAny = JSONMinidynProject

interface JSONMinidynProject {
  readonly version: 1
  readonly base: JSONBaseProject
  readonly distinct: JSONMinidynProjectDistinct
}

interface JSONMinidynProjectDistinct {
  readonly version: 1
  readonly units: JSONMinidynUnits
  readonly bearingParameters: JSONBearingParameters
}

// ---
// Object
// ---

interface MinidynProject extends BaseProject {
  readonly machine: 'Minidyn'
  readonly reports: SelectableList<MinidynReport>
  readonly units: MinidynMathUnits
  bearingParameters: JSONBearingParameters
  toJSON: () => JSONMinidynProject
}
