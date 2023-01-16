export const fetchFileFromGitlab = async (
  type: 'demo' | 'template',
  fileName: string
) => {
  const url = `https://fnckcors.deno.dev/https://gitlab.com/isaan/mapview-dev/assets/-/raw/main/${type}s/${fileName}?inline=false`

  const response = await fetch(url)

  const blob = await response.blob()

  return new File([blob], String(url.split('/').pop()))
}
