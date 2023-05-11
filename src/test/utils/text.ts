const defaultOptions: FileTransformerOpt = {
  dataType: 'noTransformation',
}

export const filesToString = (files: File[]) => {
  return Promise.all(files.map(async (file) => file.text()))
}

export const fileToStringArray = async (
  file: File | string,
  opt: FileTransformerOpt = defaultOptions
) => {
  let text: string

  if (typeof file === 'string') {
    text = file
  } else {
    text = await file.text()
  }

  let lignes = text.replaceAll('\r', '').split('\n')

  if (opt.removeBlankLine) {
    lignes = lignes.filter((ligne) => ligne.length > 0)
  }

  switch (opt.dataType) {
    case 'onlyKey':
      return lignes.map((ligne) => getKey(ligne))
    case 'onlyValue':
      return lignes.map((ligne) => getValue(ligne))
    case 'combos':
      return lignes.map((ligne) => ({
        key: getKey(ligne),
        value: getValue(ligne),
      })) as KeyValueData[]
  }

  return lignes
}

export const filesToStringArray = async (
  files: (File | string)[],
  opt: FileTransformerOpt = defaultOptions
) => {
  return Promise.all(files.map((file) => fileToStringArray(file, opt)))
}

export const getKey = (ligne: string) => {
  return ligne.split('=')[0].trim()
}

export const getValue = (ligne: string) => {
  const splitted = ligne.split('=')
  return splitted[splitted.length > 1 ? 1 : 0].trim()
}

export const parseData = (data: string) => {
  const trimedData = data.trim()

  if (trimedData === 'undefined') {
    return undefined
  }

  if (
    !Number.isNaN(Number(trimedData)) &&
    Number.isFinite(parseFloat(trimedData))
  ) {
    return Number(trimedData)
  }

  const timestamp = Date.parse(trimedData)

  if (!Number.isNaN(timestamp)) {
    return { date: new Date(timestamp), origin: trimedData } as ParsedDate
  }

  if (trimedData.includes(',')) {
    return trimedData.split(',').map((splittedData) => {
      const value = Number(splittedData)

      return Number.isNaN(value) ? splittedData : value
    })
  }

  return data
}
