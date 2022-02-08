interface BasePoint {
  machine: MachineName
  number: number
  // coordinates: mapboxgl.LngLatLike
  marker: mapboxgl.Marker
  icon: Icon
  mapviewSettings: JSONPointMapviewSettings
  // data: ComputedData
  // selectedData: number
  refreshVisibility: () => void
  addToMap: () => void
  remove: () => void
}

interface MachinePointCreatorParameters {
  number: number
  iconName: IconName
  projectMapviewSettings: JSONProjectMapviewSettings
  reportMapviewSettings: JSONReportMapviewSettings
  // rawData: MathNumberObject
  // parametersData: MathNumberObject
}

interface JSONPoint {
  coordinates: mapboxgl.LngLatLike
  // data: {
  //   DOP: number
  //   Chainage: number
  // }
  mapviewSettings: JSONPointMapviewSettings
  informations: JSONField[]
  drops: JSONDrop[]
}

interface JSONPointMapviewSettings {
  isVisible: boolean
}
