interface MaxidynPoint extends BasePoint {
  readonly machine: 'Maxidyn'
  readonly drops: MaxidynDrop[]
  zone: MaxidynZone
  informations: MaxidynField[]
}

interface MaxidynPointCreatorParameters extends MachinePointCreatorParameters {
  zone: MaxidynZone
}
