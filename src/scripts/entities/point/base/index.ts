import { Marker, Popup } from 'mapbox-gl'

import { translate } from '/src/locales'

import {
  colorsClasses,
  createDataValueFromJSON,
  createFieldFromJSON,
  createIcon,
  createWatcherHandler,
} from '/src/scripts'

export const createBasePointFromJSON = <
  Zone extends MachineZone,
  Drop extends MachineDrop
>(
  json: JSONBasePointVAny,
  map: mapboxgl.Map | null,
  parameters: {
    zone: Zone
    information: JSONField[]
    drops: Drop[]
  }
) => {
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

  const point: BasePoint<Drop, Zone> = {
    id: json.id,
    number: json.number,
    index: json.index,
    date: new Date(json.date),
    marker,
    icon,
    information: shallowReactive(
      parameters.information.map((field: JSONField) =>
        createFieldFromJSON(field)
      )
    ),
    settings: reactive(json.settings),
    zone: parameters.zone,
    data: json.data.map(
      (jsonDataValue): DataValue<string> =>
        createDataValueFromJSON(
          jsonDataValue,
          parameters.zone.report.dataLabels.groups.list[1].choices.list
        )
    ),
    drops: [],
    rawDataFile: null,
    getSelectedMathNumber: function (
      groupFrom: DataLabelsFrom,
      dataLabel: DataLabel<string>,
      index?: BaseDropIndex | null
    ) {
      let source

      switch (groupFrom) {
        case 'Drop':
          source = this.drops.find((drop) => drop.index === index)
          break
        case 'Point':
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
      index?: BaseDropIndex | null
    ) {
      const value = this.getSelectedMathNumber(groupFrom, dataLabel, index)

      return value ? value.displayedString : ''
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
            group.from === 'Drop' ? group.indexes.selected : undefined
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

          if (group && group.choices.selected) {
            const value = this.getSelectedMathNumber(
              group.from,
              group.choices.selected,
              group.from === 'Drop' ? group.indexes.selected : undefined
            )

            watcherMarkersString = watcherHandler.add(
              watch(
                () => value?.displayedString,
                (displayedString) => {
                  this.icon?.setText(displayedString || '')
                },
                {
                  immediate: true,
                }
              )
            )
          }

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
        this.marker?.getLngLat().lng.toLocaleString(undefined, {
          maximumFractionDigits: 6,
        }) || ''
      )
      appendToPopup(
        translate('Latitude'),
        this.marker?.getLngLat().lat.toLocaleString(undefined, {
          maximumFractionDigits: 6,
        }) || ''
      )

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

            let index =
              sortedPoints.findIndex((_point) => this.index === _point.index) +
              1

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
    toBaseJSON: function () {
      return {
        version: json.version,
        id: this.id,
        index: this.index,
        settings: this.settings,
        number: this.number,
        date: this.date.toJSON(),
        coordinates: this.marker?.getLngLat() || json.coordinates,
        data: this.data
          .filter((data) =>
            this.zone.report.dataLabels.groups.list[1].saveableChoices.includes(
              data.label
            )
          )
          .map((data) => data.toJSON()),
        information: this.information.map((field) => field.toJSON()),
        drops: this.drops.map((drop) => drop.toJSON()),
      }
    },
  }

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
