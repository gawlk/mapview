// ---
// JSON
// ---

type JSONMaxidynProjectVAny = JSONMaxidynProject

interface JSONMaxidynProject {
  readonly version: 1
  readonly base: JSONBaseProject
  readonly distinct: JSONMaxidynProjectDistinct
}

interface JSONMaxidynProjectDistinct {
  readonly version: 1
  readonly units: JSONMaxidynUnits
  readonly bearingParameters: JSONBearingParameters
}

// ---
// Object
// ---

interface MaxidynProject extends BaseProject {
  readonly machine: 'Maxidyn'
  readonly reports: SelectableList<MaxidynReport>
  readonly units: MaxidynMathUnits
  bearingParameters: JSONBearingParameters
  toJSON: () => JSONMaxidynProject
}
