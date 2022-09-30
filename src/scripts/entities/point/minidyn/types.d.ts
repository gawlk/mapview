interface MinidynPoint extends BasePoint {
  readonly machine: 'Minidyn'
  readonly drops: MinidynDrop[]
  zone: MinidynZone
  information: MinidynField[]
}

interface MinidynPointCreatorParameters extends MachinePointCreatorParameters {
  zone: MinidynZone
}
