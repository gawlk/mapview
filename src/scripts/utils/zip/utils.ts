import { unzipSync } from 'fflate'

import { convertJSONToFile } from '/src/scripts'

export const unzipFile = async (file: File) =>
  unzipSync(new Uint8Array(await file.arrayBuffer()))

export const addJSONToZip = async (
  zip: Fflate.Zippable,
  name: string,
  json: AnyJSON
) => addFileToZip(zip, convertJSONToFile(json, name))

export const addFileToZip = async (zip: Fflate.Zippable, file: File) => {
  zip[file.name] = new Uint8Array(await file.arrayBuffer())
}
