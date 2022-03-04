interface MinidynProject extends BaseProject {
  readonly machine: 'minidyn'
  readonly reports: SelectableList<MinidynReport>
}

interface MinidynUnits {
  modulus: MathUnit
  deformation: MathUnit
  force: MathUnit
  temperature: MathUnit
}

interface JSONMinidynUnits {
  modulus: 'MPa' | 'kN'
  deformation: 'mm' | 'um'
  force: 'N' | 'kN'
}
