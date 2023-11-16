import { convertData64ImageToUint8Array } from '/src/scripts'

export const addOverlaysToZip = async (
  zip: Zippable,
  project: MachineProject,
) => {
  const overlays: { [key: string]: Uint8Array } = {}

  await Promise.all(
    project.overlays().map(async (overlay) => {
      if (overlay.sourceData.url) {
        overlays[overlay.toJSON().name] = await convertData64ImageToUint8Array(
          overlay.sourceData.url,
        )
      }
    }),
  )

  zip.overlays = overlays
}
