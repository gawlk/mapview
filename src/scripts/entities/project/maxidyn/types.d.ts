interface MaxidynProject extends BaseProject {
  readonly machine: 'maxidyn'
  readonly reports: SelectableList<MaxidynReport>
}

interface MaxidynUnits {
  modulus: MathUnit
  deformation: MathUnit
  force: MathUnit
}

interface JSONMaxidynUnits {
  modulus: 'MPa' | 'kN'
  deformation: 'mm' | 'um'
  force: 'N' | 'kN'
}
