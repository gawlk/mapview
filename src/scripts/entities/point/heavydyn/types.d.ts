interface HeavydynPoint extends BasePoint {
  readonly machine: 'Heavydyn'
  readonly drops: HeavydynDrop[]
  zone: HeavydynZone
  information: HeavydynField[]
}

interface HeavydynPointCreatorParameters extends MachinePointCreatorParameters {
  zone: HeavydynZone
}
