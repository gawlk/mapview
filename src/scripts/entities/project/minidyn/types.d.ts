interface MinidynProject extends BaseProject {
  readonly machine: 'minidyn'
}

interface JSONMinidynUnits {
  modulus: 'MPa' | 'kN'
  deformation: 'mm' | 'um'
  force: 'N' | 'kN'
}
