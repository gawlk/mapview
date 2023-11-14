/* eslint-disable sonarjs/cognitive-complexity */
import { ReactiveMap } from '@solid-primitives/map'
import mapboxgl, { Marker, Popup } from 'mapbox-gl'

import { translate } from '/src/locales'
import {
  colors,
  createASS,
  createDataValueFromJSON,
  createFieldFromJSON,
  createIcon,
} from '/src/scripts'
import { store } from '/src/store'
import { env } from '/src/env'

export const createBasePointFromJSON = <
  Zone extends MachineZone,
  Drop extends MachineDrop,
>(
  json: JSONBasePointVAny,
  map: mapboxgl.Map | null,
  parameters: {
    zone: Zone
    information: JSONField[]
    drops: Drop[]
  },
) => {
  json = upgradeJSON(json)

  const icon = createIcon(parameters.zone.report().settings.iconName())

  const marker = icon
    ? new Marker({
        element: icon.element,
        draggable: !parameters.zone
          .report()
          .project()
          .settings.arePointsLocked(),
      }).setLngLat(json.coordinates)
    : null

  const coordinates = createASS(marker?.getLngLat())

  marker?.on('drag', () => {
    coordinates.set(marker.getLngLat())
  })

  const dataset = new ReactiveMap<DataLabel, DataValue<string>>()
  json.data.forEach((jsonDataValue) => {
    const dataValue = createDataValueFromJSON(
      jsonDataValue,
      parameters.zone.report().dataLabels.groups.list()[1].choices.list(),
    )

    dataset.set(dataValue.label, dataValue)
  })

  const settings = createPointSettingsFromJSON(json.settings)

  const zone = createASS(parameters.zone)

  const point: BasePoint<Drop, Zone> = {
    id: json.id,
    number: createASS(json.number),
    index: createASS(json.index),
    date: new Date(json.date),
    marker,
    icon,
    information: parameters.information.map((field: JSONField) =>
      createFieldFromJSON(field),
    ),
    settings,
    zone,
    dataset,
    coordinates,
    drops: [],
    rawDataFile: createASS(null),
    onMapMathNumber: createMemo(() => {
      const group = zone().report().dataLabels.groups.selected()
      const selected = group?.choices.selected()

      if (!group || !selected) return

      return point.getMathNumber(
        group.from,
        selected,
        group.from === 'Drop' ? group.indexes.selected() : undefined,
      )
    }),
    getMathNumber(
      groupFrom: DataLabelsFrom,
      dataLabel: DataLabel<string>,
      index?: BaseDropIndex | null,
    ) {
      let source

      switch (groupFrom) {
        case 'Drop':
          source = this.drops.find((drop) => drop.index === index)
          break
        case 'Point':
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          source = this
          break

        default:
          break
      }

      return source?.dataset.get(dataLabel)?.value
    },
    getDisplayedString(
      groupFrom: DataLabelsFrom,
      dataLabel: DataLabel<string>,
      index?: BaseDropIndex | null,
    ) {
      const value = this.getMathNumber(groupFrom, dataLabel, index)

      return value ? value.displayedString() : ''
    },
    shouldBeOnMap: createMemo(() => {
      const _zone = zone()
      const report = _zone.report()
      const project = report.project()

      return (
        settings.isVisible() &&
        _zone.settings.isVisible() &&
        report.settings.isVisible() &&
        project.settings.arePointsVisible() &&
        (env.isTest || store.selectedProject() === project)
      )
    }),
    toBaseJSON() {
      return {
        version: 1,
        id: this.id,
        index: this.index(),
        settings: this.settings.toJSON(),
        number: this.number(),
        date: this.date.toJSON(),
        coordinates: this.marker?.getLngLat() || json.coordinates,
        data: Array.from(this.dataset.values())
          .filter((data) =>
            this.zone()
              .report()
              .dataLabels.groups.list()[1]
              .saveableChoices.includes(data.label),
          )
          .map((data) => data.toJSON()),
        information: this.information.map((field) => field.toJSON()),
        drops: this.drops.map((drop) => drop.toJSON()),
      }
    },
  }

  createMapEffect(point, map)

  createEffect(() => {
    if (point.shouldBeOnMap()) {
      createIconEffect(point)

      createColorEffect(point)

      createTextEffect(point)

      createPopupEffect(point)

      createLockEffect(point)
    }
  })

  return point
}

const upgradeJSON = (json: JSONBasePointVAny): JSONBasePoint => {
  switch (json.version) {
    case 1:
    // upgrade
  }

  return json
}

const createPointSettingsFromJSON = (
  json: JSONPointSettings,
): PointSettings => ({
  isVisible: createASS(json.isVisible),
  toJSON() {
    return {
      version: 1,
      isVisible: this.isVisible(),
    }
  },
})

const createMapEffect = <Zone extends MachineZone, Drop extends MachineDrop>(
  point: BasePoint<Drop, Zone>,
  map: mapboxgl.Map | null,
) => {
  createEffect(() => {
    if (map) {
      if (point.shouldBeOnMap()) {
        point.marker?.addTo(map)
      } else {
        point.marker?.remove()
      }
    }
  })
}

const createIconEffect = <Zone extends MachineZone, Drop extends MachineDrop>(
  point: BasePoint<Drop, Zone>,
) => {
  createEffect(() => {
    point.icon?.setIcon(point.zone().report().settings.iconName())
  })
}

const createTextEffect = <Zone extends MachineZone, Drop extends MachineDrop>(
  point: BasePoint<Drop, Zone>,
) => {
  const text = createMemo(() => {
    switch (point.zone().report().project().settings.pointsState()) {
      case 'number':
        return String(point.number())

      case 'value':
        return point.onMapMathNumber()?.displayedString() || ''

      case 'nothing':
        return ''
    }
  })

  createEffect(() => {
    point.icon?.setText(text())
  })
}

const createColorEffect = <Zone extends MachineZone, Drop extends MachineDrop>(
  point: BasePoint<Drop, Zone>,
) => {
  const currentThreshold = createMemo(() => {
    const mathNumber = point.onMapMathNumber()

    const unit = mathNumber?.unit

    if (!unit) return

    return (
      Object.values(point.zone().report().thresholds.groups).find(
        (_group) => _group.unit === unit,
      ) as ThresholdsGroup<string>
    )?.choices.selected()
  })

  const color = createMemo(() => {
    if (point.zone().report().settings.colorization() === 'Zone') {
      return colors[point.zone().settings.color()]
    }

    const mathNumber = point.onMapMathNumber()

    if (!mathNumber) return

    return currentThreshold()?.getColor(
      mathNumber,
      point.zone().report().thresholds.colors,
    )
  })

  createEffect(() => {
    point.icon?.setColor(color())
  })
}

const createPopupEffect = <Zone extends MachineZone, Drop extends MachineDrop>(
  point: BasePoint<Drop, Zone>,
) => {
  const popup = createMemo(() => {
    let html = ``

    const appendToPopup = (label: string, value: string) => {
      html += `<p><strong>${label}:</strong> ${value}</p>`
    }

    appendToPopup(translate('Date'), point.date.toLocaleString())
    appendToPopup(
      translate('Longitude'),
      point.coordinates()?.lng.toLocaleString(undefined, {
        maximumFractionDigits: 6,
      }) || '',
    )
    appendToPopup(
      translate('Latitude'),
      point.coordinates()?.lat.toLocaleString(undefined, {
        maximumFractionDigits: 6,
      }) || '',
    )

    point.dataset.forEach((dataValue) => {
      appendToPopup(
        translate(dataValue.label.name),
        dataValue.value.displayedStringWithUnit(),
      )
    })

    point.information.forEach((field) => {
      appendToPopup(translate(field.label), String(field.getValue()))
    })

    return html
  })

  createEffect(() => {
    point.marker?.setPopup(new Popup().setHTML(popup()))
  })
}

const createLockEffect = <Zone extends MachineZone, Drop extends MachineDrop>(
  point: BasePoint<Drop, Zone>,
) => {
  createEffect(
    () =>
      point.marker?.setDraggable(
        !point.zone().report().project().settings.arePointsLocked(),
      ),
  )
}
