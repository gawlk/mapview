export const fileToStringArray = async (
  file: File | string,
  opt: FileTransformerOpt = {}
) => {
  let text: string

  if (typeof file === 'string') {
    text = await file
  } else {
    text = await file.text()
  }

  let lignes = text.replaceAll('\r', '').split('\n')

  if (opt.removeBlankLine) {
    lignes = lignes.filter((ligne) => ligne.length > 0)
  }

  return lignes
}

export const getKey = (ligne: string) => {
  return ligne.split('=')[0].trim()
}
