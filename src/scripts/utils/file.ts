import { encode as encodeWindows } from 'windows-1252'

import { formatForExport } from './formatting'
import { run } from './run'

export const reservedFileNameWords = run(() => {
  const words = ['CON', 'PRN', 'AUX', 'NUL']

  for (let i = 1; i < 9; i++) {
    words.push(`COM${i}`, `LPT${i}`)
  }

  return words
})

export const convertFileToDataURL = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

export const convertUint8arrayToXML = (array: Uint8Array) => {
  const stringified = new TextDecoder().decode(array)
  const parser = new DOMParser()
  return parser.parseFromString(stringified, 'text/xml')
}

export const convertJSONToFile = (json: JSONAny, name: string) =>
  new File([JSON.stringify(json, null, 2)], name, {
    type: 'json',
  })

export const convertUint8ArrayToData64Image = (
  array: Uint8Array,
  extension: string,
) =>
  `data:image/${extension === 'png' ? extension : 'jpeg'};base64,` +
  window.btoa(
    Array.from(array)
      .map((value) => String.fromCharCode(value))
      .join(''),
  )

export const convertData64ImageToFile = (data64: string) =>
  convertData64ToFile(data64, 'screenshot.png', {
    type: 'image/png',
  })

export const convertBase64toBlob = (
  b64Data: string,
  contentType = '',
  sliceSize = 512,
) => {
  const byteCharacters = atob(b64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  return new Blob(byteArrays, { type: contentType })
}

export const convertData64ToFile = (
  data64: string,
  fileName?: string,
  options?: FilePropertyBag | undefined,
) =>
  new File(
    [convertBase64toBlob(data64.split('base64,')[1], 'image/png')],
    fileName || 'file',
    options,
  )

export const convertData64ImageToUint8Array = async (data64: string) => {
  const file = convertData64ImageToFile(data64)

  return new Uint8Array(await file.arrayBuffer())
}

export const downloadImage = (screenshot: string) =>
  downloadFile(convertData64ImageToFile(screenshot))

export function convertFileNameToValidName(name: string, hasExtension = true) {
  let toCheck = name
  let extension = ''

  if (hasExtension && name.includes('.')) {
    const index = name.lastIndexOf('.')
    toCheck = name.slice(0, index)
    extension = name.slice(index, name.length)
  }

  if (
    reservedFileNameWords.includes(toCheck.toUpperCase()) ||
    toCheck.length === 0
  ) {
    return `_${extension}`
  }

  return `${toCheck
    .trim()
    .replaceAll(/[\\|/*<>:"?\x00-\x1F]/g, '_')}${extension}`
}

export const downloadFile = (file: File) => {
  const a = document.createElement('a')

  a.href = URL.createObjectURL(file)
  a.download = convertFileNameToValidName(file.name)

  a.target = '_blank' // Needed for Safari
  a.click()
  a.remove()
}

export const downloadTSV = (
  fileName: string,
  datasets: string[][],
  windows?: true,
) => {
  if (Array.from(new Set(datasets.map((d) => d.length))).length > 1) {
    throw Error(`Arrays don't have the same length`)
  }

  downloadFile(
    new File(
      [
        (windows ? encodeWindows : encodeURI)(
          formatForExport(convertDatasetsToCSVString(datasets, '\t')),
        ),
      ],
      fileName,
      { type: 'text/tab-separated-values' },
    ),
  )
}

export const convertDatasetsToCSVString = (
  datasets: string[][],
  delimiter = ';',
) =>
  `${datasets
    .map((dataset) =>
      dataset
        .map((value) =>
          String(
            typeof value === 'string' && value.includes(delimiter)
              ? `"${value}"`
              : value || '',
          ).replaceAll('\n', ''),
        )
        .join(delimiter),
    )
    .join('\n')}`
