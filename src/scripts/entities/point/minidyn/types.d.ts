interface MinidynPoint extends BasePoint {
  readonly machine: 'Minidyn'
  readonly drops: MinidynDrop[]
  zone: MinidynZone
  informations: MinidynField[]
}

interface MinidynPointCreatorParameters extends MachinePointCreatorParameters {
  zone: MinidynZone
}
