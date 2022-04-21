import { Marker } from 'mapbox-gl'

import {
  createIcon,
  createWatcherHandler,
  createMathNumber,
} from '/src/scripts'

export const createBasePointFromJSON = (
  json: JSONPoint,
  map: mapboxgl.Map,
  parameters: BasePointCreatorParameters
): MachinePoint => {
  const icon = createIcon(parameters.iconName)

  const marker = new Marker({
    element: icon.element,
    draggable: !parameters.projectSettings.arePointsLocked,
  }).setLngLat(json.coordinates)

  const watcherHandler = createWatcherHandler()

  let watcherMarkersString: any

  const point = shallowReactive({
    machine: parameters.machine,
    id: `${+new Date()}-${Math.random()}`,
    number: parameters.number,
    marker,
    icon,
    settings: reactive(json.settings),
    data: json.data.map((jsonDataValue): DataValue => {
      const label = parameters.reportDataLabels.groups.list
        .find((groupedDataLabels) => groupedDataLabels.from === 'Test')
        ?.choices.list.find(
          (dataLabel) => dataLabel.name === jsonDataValue.label
        ) as DataLabel

      return {
        label,
        value: createMathNumber(jsonDataValue.value, label.unit),
      }
    }),
    drops: [],
    zone: null,
    getSelectedMathNumber: function (
      groupFrom: DataLabelsFrom,
      dataLabel: DataLabel,
      index?: MachineDropIndex | null
    ) {
      let source

      switch (groupFrom) {
        case 'Drop':
          source = this.drops.find((drop) => drop.index === index)
          break
        case 'Test':
          source = this
          break

        default:
          break
      }

      const value = source?.data.find(
        (dataValue) => dataValue.label === dataLabel
      )?.value

      return value
    },
    getDisplayedString: function (
      groupFrom: DataLabelsFrom,
      dataLabel: DataLabel,
      index?: MachineDropIndex | null
    ) {
      const value = this.getSelectedMathNumber(groupFrom, dataLabel, index)

      return typeof value === 'object' ? value.displayedString : ''
    },
    updateColor: function () {
      if (parameters.reportSettings.selectedColorization === 'Zone') {
        this.icon.setColor(this.zone?.color)
      } else {
        const group = parameters.reportDataLabels.groups.selected

        if (group && group.choices.selected) {
          const mathNumber = this.getSelectedMathNumber(
            group.from,
            group.choices.selected,
            group.indexes?.selected
          )

          const unit = mathNumber?.unit

          const threshold = parameters.reportThresholds.groups.find(
            (group) => group.unit === unit
          )?.choices.selected

          if (unit && threshold) {
            const color = threshold.getColor(
              mathNumber,
              parameters.reportThresholds.colors
            )

            this.icon.setColor(color)
          } else {
            this.icon.setColor()
          }
        }
      }
    },
    updateText: function () {
      if (watcherMarkersString) {
        watcherMarkersString = watcherHandler.remove(watcherMarkersString)
      }

      switch (parameters.projectSettings.pointsState) {
        case 'number':
          watcherMarkersString = watcherHandler.add(
            watch(
              () => this.number,
              (number) => {
                this.icon.setText(String(number))
              },
              {
                immediate: true,
              }
            )
          )

          break
        case 'value':
          const group = parameters.reportDataLabels.groups.selected

          let text = ''

          if (group && group.choices.selected) {
            text = this.getDisplayedString(
              group.from,
              group.choices.selected,
              group.indexes?.selected
            )
          }

          this.icon.setText(text)

          break
        case 'nothing':
          this.icon.setText('')
          break
      }
    },
    updateVisibility: function () {
      if (
        parameters.projectSettings.arePointsVisible &&
        parameters.reportSettings.isVisible &&
        (!this.zone || this.zone?.isVisible) &&
        this.settings.isVisible
      ) {
        this.marker.addTo(map)
      } else {
        this.marker.remove()
      }
    },
    addToMap: function () {
      this.updateVisibility()
      this.updateText()
      this.updateColor()
    },
    remove: function () {
      this.marker.remove()
      watcherHandler.clean()
    },
  } as BasePoint)

  return point
}
