// ---
// JSON
// ---

type JSONMinidynProjectVAny = JSONMinidynProject

interface JSONMinidynProject {
  readonly version: 1
  readonly machine: 'Minidyn'
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

interface MinidynProject
  extends MinidynObject<JSONMinidynProject>,
    BaseProject<MinidynReport, MinidynMathUnits>,
    DisposableObject {
  readonly bearingParameters: JSONBearingParameters
}
