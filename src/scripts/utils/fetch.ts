export const fetchFileFromURL = async (url: string) => {
  const response = await fetch(url)

  const blob = await response.blob()

  const fileName = String(url.split('/').pop())

  return new File([blob], fileName)
}
