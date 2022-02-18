import { LngLatBounds } from 'mapbox-gl'
import {
  createBaseFieldFromJSON,
  createSelectableList,
  createWatcherHandler,
  mapStyles,
} from '/src/scripts'

export const createBaseProjectFromJSON = async (
  json: JSONProject,
  map: mapboxgl.Map,
  parameters: BaseProjectCreatorParameters
) => {
  const watcherHandler = createWatcherHandler()

  const settings = reactive(json.settings)

  const project: BaseProject = shallowReactive({
    machine: parameters.machine,
    name: createBaseFieldFromJSON(
      {
        name: 'Name',
        value: json.name,
      },
      true
    ),
    reports: createSelectableList<MachineReport>(null, [], true),
    images: shallowReactive([] as Image[]),
    units: parameters.units,
    settings,
    informations: shallowReactive([]),
    refreshLinesAndImages: function () {
      if (this.settings.arePointsLinked) {
        this.reports.list.forEach((report) => {
          report.isOnMap && report.settings.isVisible && report.line.addToMap()
        })
      }

      this.images.forEach((image) => {
        image.addToMap(this.settings.areImagesVisible)
      })
    },
    setMapStyle: function (styleIndex: number) {
      const oldMapStyle = map.getStyle().sprite?.split('/').pop()
      const newMapStyle = mapStyles[styleIndex].split('/').pop()

      if (oldMapStyle === newMapStyle) {
        this.refreshLinesAndImages()
      } else {
        map.setStyle(mapStyles[styleIndex])
      }
    },
    fitOnMap: function () {
      const bounds = new LngLatBounds()

      this.reports.list.forEach((report: MachineReport) => {
        report.points.forEach((point: MachinePoint) => {
          bounds.extend(point.marker.getLngLat())
        })
      })

      map.fitBounds(bounds, { padding: 100 })
    },
    addToMap: function () {
      console.log('project add')

      if (this.settings.map.coordinates && this.settings.map.zoom) {
        map.flyTo({
          center: this.settings.map.coordinates,
          zoom: this.settings.map.zoom,
          essential: true,
        })
      } else {
        this.reports.selected?.fitOnMap()
      }

      this.setMapStyle(this.settings.map.styleIndex)

      this.reports.list.forEach((report) => {
        report.addToMap()
      })

      watcherHandler.add(
        watch(
          () => this.settings.arePointsVisible,
          () => {
            this.reports.list.forEach((report: MachineReport) => {
              report.points.forEach((point) => {
                point.updateVisibility()
              })
            })
          }
        )
      )

      watcherHandler.add(
        watch(
          () => this.settings.arePointsLinked,
          (arePointsLinked: boolean) => {
            this.reports.list.forEach((report: MachineReport) => {
              report.settings.isVisible && arePointsLinked
                ? report.line?.addToMap()
                : report.line?.remove()
            })
          }
        )
      )

      watcherHandler.add(
        watch(
          () => this.settings.arePointsLocked,
          (arePointsLocked: boolean) => {
            this.reports.list.forEach((report: MachineReport) => {
              report.points.forEach((point) => {
                point.marker.setDraggable(!arePointsLocked)
              })
            })
          }
        )
      )

      watcherHandler.add(
        watch(
          () => this.settings.areImagesVisible,
          (areImagesVisible: boolean) => {
            this.images.forEach((image: Image) => {
              map.setPaintProperty(
                image.id,
                'raster-opacity',
                areImagesVisible ? image.opacity : 0
              )

              if (areImagesVisible) {
                image.markerNW.addTo(map)
                image.markerSE.addTo(map)
              } else {
                image.markerNW.remove()
                image.markerSE.remove()
              }
            })
          }
        )
      )

      watcherHandler.add(
        watch(
          () => this.settings.pointsState,
          () => {
            this.reports.list.forEach((report: MachineReport) => {
              report.points.forEach((point) => {
                point.updateText()
              })
            })
          }
        )
      )

      watcherHandler.add(
        watch(
          () => this.settings.map.styleIndex,
          (styleIndex: number) => {
            this.setMapStyle(styleIndex)
          }
        )
      )

      watcherHandler.add(
        watch(
          () => this.images,
          (images, oldImages) => {
            console.log('images update', images, oldImages)

            images.forEach((image) => {
              if (!oldImages.includes(image)) {
                image.addToMap(this.settings.areImagesVisible)
              }
            })
          }
        )
      )
    },
    remove: function () {
      this.reports.list.forEach((report) => {
        report.remove()
      })

      this.images.forEach((image) => image.remove())

      watcherHandler.clean()
    },
  })

  return project
}
