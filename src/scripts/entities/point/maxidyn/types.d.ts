interface MaxidynPoint extends BasePoint {
  readonly machine: 'Maxidyn'
  readonly drops: MaxidynDrop[]
  zone: MaxidynZone
}

interface MaxidynPointCreatorParameters extends MachinePointCreatorParameters {
  zone: MaxidynZone
}
