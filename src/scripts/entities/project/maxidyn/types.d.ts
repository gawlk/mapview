// ---
// JSON
// ---

type JSONMaxidynProjectVAny = JSONMaxidynProject

interface JSONMaxidynProject {
  readonly version: 1
  readonly machine: 'Maxidyn'
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

interface MaxidynProject
  extends MaxidynObject<JSONMaxidynProject>,
    BaseProject<MaxidynReport, MaxidynMathUnits> {
  bearingParameters: JSONBearingParameters
}
