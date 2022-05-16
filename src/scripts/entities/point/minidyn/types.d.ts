interface MinidynPoint extends BasePoint {
  readonly machine: 'Minidyn'
  readonly drops: MinidynDrop[]
  zone: MinidynZone
}

interface MinidynPointCreatorParameters extends MachinePointCreatorParameters {
  zone: MinidynZone
}
