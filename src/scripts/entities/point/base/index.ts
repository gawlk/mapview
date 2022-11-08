import { Marker, Popup } from 'mapbox-gl'

import { translate } from '/src/locales'
import {
  createIcon,
  createWatcherHandler,
  colorsClasses,
  createDataValueFromJSON,
} from '/src/scripts'

interface BasePointCreatorParameters extends MachinePointCreatorParameters {
  machine: MachineName
}

export const createBasePointFromJSON = (
  json: JSONBasePointVAny,
  map: mapboxgl.Map | null,
  parameters: BasePointCreatorParameters
): BasePoint => {
  json = upgradeJSON(json)

  const icon = createIcon(parameters.zone.report.settings.iconName)

  const marker = icon
    ? new Marker({
        element: icon.element,
        draggable: !parameters.zone.report.project.settings.arePointsLocked,
      }).setLngLat(json.coordinates)
    : null

  const watcherHandler = createWatcherHandler()

  let watcherMarkersString: any

  const point: BasePoint = shallowReactive({
    machine: parameters.machine,
    id: json.id,
    number: json.number,
    index: json.index,
    date: new Date(json.date),
    marker,
    icon,
    information: [] as Field[],
    settings: reactive(json.settings),
    zone: parameters.zone,
    data: json.data.map(
      (jsonDataValue): DataValue<string> =>
        createDataValueFromJSON(
          jsonDataValue,
          (
            parameters.zone.report.dataLabels.groups
              .list as MachineGroupedDataLabels[]
          ).find((groupedDataLabels) => groupedDataLabels.from === 'Test')
            ?.choices.list || []
        )
    ),
    drops: [] as MachineDrop[],
    rawDataFile: null,
    getSelectedMathNumber: function (
      groupFrom: DataLabelsFrom,
      dataLabel: DataLabel<string>,
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
      dataLabel: DataLabel<string>,
      index?: MachineDropIndex | null
    ) {
      const value = this.getSelectedMathNumber(groupFrom, dataLabel, index)

      return typeof value === 'object' ? value.displayedString : ''
    },
    updateColor: function () {
      if (this.zone.report.settings.colorization === 'Zone') {
        this.icon?.setColor(
          colorsClasses[this.zone.settings.color as ColorName].hexColor
        )
      } else {
        const group = this.zone.report.dataLabels.groups.selected

        if (group && group.choices.selected) {
          const mathNumber = this.getSelectedMathNumber(
            group.from,
            group.choices.selected,
            group.indexes?.selected
          )

          const unit = mathNumber?.unit

          if (unit) {
            const threshold = Object.values(
              this.zone.report.thresholds.groups
            ).find((group) => group.unit === unit)?.choices.selected

            const color = threshold.getColor(
              mathNumber,
              this.zone.report.thresholds.colors
            )

            this.icon?.setColor(color)
          } else {
            this.icon?.setColor()
          }
        }
      }
    },
    updateText: function () {
      if (watcherMarkersString) {
        watcherMarkersString = watcherHandler.remove(watcherMarkersString)
      }

      switch (this.zone.report.project.settings.pointsState) {
        case 'number':
          watcherMarkersString = watcherHandler.add(
            watch(
              () => this.number,
              (number) => {
                this.icon?.setText(String(number))
              },
              {
                immediate: true,
              }
            )
          )

          break
        case 'value':
          const group = this.zone.report.dataLabels.groups.selected

          let text = ''

          if (group && group.choices.selected) {
            text = this.getDisplayedString(
              group.from,
              group.choices.selected,
              group.indexes?.selected
            )
          }

          this.icon?.setText(text)

          break
        case 'nothing':
          this.icon?.setText('')
          break
      }
    },
    updateVisibility: function () {
      if (this.checkVisibility()) {
        map && this.marker?.addTo(map)
      } else {
        this.marker?.remove()
      }
    },
    updatePopup: function () {
      let html: string = ``

      const appendToPopup = (label: string, value: string) =>
        (html += `<p><strong>${label}:</strong> ${value}</p>`)

      appendToPopup(translate('Date'), this.date.toLocaleString())
      appendToPopup(
        translate('Longitude'),
        String(this.marker?.getLngLat().lng)
      )
      appendToPopup(translate('Latitude'), String(this.marker?.getLngLat().lat))

      this.data.forEach((dataValue) => {
        appendToPopup(
          translate(dataValue.label.name),
          dataValue.value.displayedStringWithUnit
        )
      })

      this.marker?.setPopup(new Popup().setHTML(html))
    },
    addToMap: function () {
      this.updateVisibility()
      this.updateText()
      this.updateColor()
      this.updatePopup()

      watcherHandler.add(
        watch(
          () => this.settings.isVisible,
          () => {
            const sortedPoints = this.zone.report.line.sortedPoints

            point.updateVisibility()

            let index = sortedPoints.findIndex((_point) => point === _point) + 1

            for (index; index < sortedPoints.length; index++) {
              sortedPoints[index].number += point.settings.isVisible ? 1 : -1
            }

            this.zone.report.line.update()
          }
        )
      )
    },
    checkVisibility: function () {
      return (
        this.settings.isVisible &&
        this.zone.settings.isVisible &&
        this.zone.report.settings.isVisible &&
        this.zone.report.project.settings.arePointsVisible
      )
    },
    remove: function () {
      this.marker?.remove()
      watcherHandler.clean()
    },
    toBaseJSON: function (): JSONBasePoint {
      return {
        version: json.version,
        id: this.id,
        index: this.index,
        settings: this.settings,
        number: this.number,
        date: this.date.toJSON(),
        coordinates: this.marker?.getLngLat() || json.coordinates,
        data: this.data.map((data) => data.toJSON()),
        information: this.information.map((field) => field.toJSON()),
        drops: this.drops.map(
          (drop) => drop.toJSON() as unknown as JSONMachineDrop
        ),
      }
    },
  })

  marker?.on('dragend', () => point.updatePopup())

  return point
}

const upgradeJSON = (json: JSONBasePointVAny): JSONBasePoint => {
  switch (json.version) {
    case 1:
    // upgrade
    default:
      json = json as JSONBasePoint
  }

  return json
}
