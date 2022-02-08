interface HeavydynProject extends BaseProject {
  readonly machine: 'heavydyn'
}

interface JSONHeavydynUnits {
  deformation: 'mm' | '1/100 mm' | 'um'
  force: 'N' | 'kN' | 'lbs'
  temperature: 'degC' | 'degF' | 'K'
}
