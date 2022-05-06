interface MinidynZone extends BaseZone {
  readonly machine: 'Minidyn'
  readonly points: MinidynPoint[]
}

interface MinidynZoneCreatorParameters extends MachineZoneCreatorParameters {}
