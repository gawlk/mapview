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
  window.btoa(String.fromCharCode(...array))
