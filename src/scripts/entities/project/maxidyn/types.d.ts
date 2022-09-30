// ---
// JSON
// ---

type JSONMaxidynProjectVAny = JSONMaxidynProject

interface JSONMaxidynProject {
  version: 1
  base: JSONBaseProject
  distinct: JSONMaxidynProjectDistinct
}

interface JSONMaxidynProjectDistinct {
  version: 1
  units: JSONMaxidynUnits
  bearingParameters: JSONBearingParameters
}

// ---
// Object
// ---

interface MaxidynProject extends BaseProject {
  readonly machine: 'Maxidyn'
  readonly reports: SelectableList<MaxidynReport>
  readonly units: MaxidynMathUnits
  readonly information: MaxidynField[]
  readonly hardware: MaxidynField[]
  bearingParameters: JSONBearingParameters
  toJSON: () => JSONMaxidynProject
}
