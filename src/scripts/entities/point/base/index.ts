import { Marker, Popup } from 'mapbox-gl'

import {
  createIcon,
  createWatcherHandler,
  createMathNumber,
  colorsClasses,
} from '/src/scripts'
import { getBrowserLocale } from '/src/locales'
import translationsFR from '/src/locales/fr.json?raw'

export const createBasePointFromJSON = (
  json: JSONPoint,
  map: mapboxgl.Map | null,
  parameters: BasePointCreatorParameters
) => {
  const icon = createIcon(parameters.zone.report.settings.iconName)

  const marker = icon
    ? new Marker({
        element: icon.element,
        draggable: !parameters.zone.report.project.settings.arePointsLocked,
      }).setLngLat(json.coordinates)
    : null

  const watcherHandler = createWatcherHandler()

  let watcherMarkersString: any

  const point = shallowReactive({
    machine: parameters.machine,
    id: `${+new Date()}-${Math.random()}`,
    number: json.number,
    index: json.index,
    date: new Date(json.date),
    marker,
    icon,
    informations: [],
    settings: reactive(json.settings),
    zone: parameters.zone,
    data: json.data.map((jsonDataValue): DataValue => {
      const label = parameters.zone.report.dataLabels.groups.list
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

          const threshold = this.zone.report.thresholds.groups.find(
            (group) => group.unit === unit
          )?.choices.selected

          if (unit && threshold) {
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
      const locale = getBrowserLocale(true)

      let html: string = ''

      this.data.forEach((dataValue) => {
        let name = dataValue.label.name

        const translations = {
          fr: JSON.parse(translationsFR),
        }

        name =
          locale === 'fr' && name in translations.fr
            ? translations.fr[name]
            : name

        html += `<p><strong>${name}:</strong> ${dataValue.value.displayedStringWithUnit}</p>`
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
  } as BasePoint)

  return point
}
