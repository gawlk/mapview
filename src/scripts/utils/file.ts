export const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
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

export const convertData64ImageToUint8Array = async (data64: string) => {
  const res = await fetch(data64)
  const blob = await res.blob()

  return new Uint8Array(
    await new Blob([blob], {
      type: 'image/png',
    }).arrayBuffer()
  )
}

export const downloadImage = (screenshot: string) =>
  downloadFile(new File([screenshot], 'screenshot.png'))

export const downloadFile = async (file: File) => {
  const a = document.createElement('a')

  a.href = URL.createObjectURL(file)
  a.download = file.name

  a.target = '_blank' // Needed for Safari
  a.click()
  a.remove()
}
