interface HeavydynProject extends BaseProject {
  readonly machine: 'heavydyn'
  reports: SelectableList<HeavydynReport>
}

interface HeavydynUnits {
  deformation: MathUnit
  force: MathUnit
  temperature: MathUnit
}

interface JSONHeavydynUnits {
  deformation: 'mm' | '1/100 mm' | 'um'
  force: 'N' | 'kN' | 'lbs'
  temperature: 'degC' | 'degF' | 'K'
}
