export const reservedWords = (() => {
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

export const convertJSONToFile = (json: AnyJSON, name: string) =>
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

  return await new File([blob], 'screenshot.png', {
    type: 'image/png',
  })
}

export const convertData64ImageToUint8Array = async (data64: string) => {
  const file = await convertData64ImageToFile(data64)

  return new Uint8Array(await file.arrayBuffer())
}

export const downloadImage = async (screenshot: string) =>
  downloadFile(await convertData64ImageToFile(screenshot))

export function isValidFileNAme(name: string) {
  return (
    name.length > 0 &&
    !/[\\\|\/*<>:"?\x00-\x1F]/.test(name) &&
    reservedWords.includes(name.toUpperCase())
  )
}

export const downloadFile = async (file: File) => {
  console.log('file', file)
  const a = document.createElement('a')

  a.href = URL.createObjectURL(file)
  a.download = file.name

  console.log('a', a)

  a.target = '_blank' // Needed for Safari
  a.click()
  a.remove()
}
