interface HeavydynPoint extends BasePoint {
  readonly machine: 'Heavydyn'
  readonly drops: HeavydynDrop[]
  zone: HeavydynZone
  informations: HeavydynField[]
}

interface HeavydynPointCreatorParameters extends MachinePointCreatorParameters {
  zone: HeavydynZone
}
