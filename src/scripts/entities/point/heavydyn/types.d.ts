interface HeavydynPoint extends BasePoint {
  readonly machine: 'Heavydyn'
  readonly drops: HeavydynDrop[]
  zone: HeavydynZone
}

interface HeavydynPointCreatorParameters extends MachinePointCreatorParameters {
  zone: HeavydynZone
}
