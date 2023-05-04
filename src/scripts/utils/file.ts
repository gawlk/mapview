export const reservedFileNameWords = (() => {
  const words = ['CON', 'PRN', 'AUX', 'NUL']

  for (let i = 1; i < 9; i++) {
    words.push(`COM${i}`, `LPT${i}`)
  }

  return words
})()

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

export const convertJSONToFile = (json: RecordAny, name: string) =>
  new File([JSON.stringify(json, null, 2)], name, {
    type: 'json',
  })

export const convertUint8ArrayToData64Image = (
  array: Uint8Array,
  extension: string
) =>
  `data:image/${extension === 'png' ? extension : 'jpeg'};base64,` +
  window.btoa(
    Array.from(array)
      .map((value) => String.fromCharCode(value))
      .join('')
  )

export const convertData64ImageToFile = async (data64: string) => {
  const res = await fetch(data64)
  const blob = await res.blob()

  return new File([blob], 'screenshot.png', {
    type: 'image/png',
  })
}

export const convertData64ImageToUint8Array = async (data64: string) => {
  const file = await convertData64ImageToFile(data64)

  return new Uint8Array(await file.arrayBuffer())
}

export const downloadImage = async (screenshot: string) =>
  downloadFile(await convertData64ImageToFile(screenshot))

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
