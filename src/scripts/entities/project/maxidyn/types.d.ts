interface MaxidynProject extends BaseProject {
  readonly machine: 'maxidyn'
}

interface JSONMaxidynUnits {
  modulus: 'MPa' | 'kN'
  deformation: 'mm' | 'um'
  force: 'N' | 'kN'
}
