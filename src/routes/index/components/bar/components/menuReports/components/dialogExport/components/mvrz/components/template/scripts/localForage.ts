import localForage from 'localforage'

import { convertFileToDataURL, fetchFileFromURL } from '/src/scripts'

interface TemplateObject {
  machine: MachineName
  glob: Record<string, () => Promise<unknown>>
}

interface FileObject {
  fileName: string
  path: string
}

export const getTemplateKey = (machine: MachineName, number: number) =>
  `template${machine.toLowerCase()}${number}`

export const initDemoTemplates = () => {
  const extension = '.xlsx'

  const templateObjects: TemplateObject[] = [
    {
      machine: 'Heavydyn',
      glob: import.meta.glob('/src/assets/templates/heavydyn/*'),
    },
    {
      machine: 'Maxidyn',
      glob: import.meta.glob('/src/assets/templates/maxidyn/*'),
    },
    {
      machine: 'Minidyn',
      glob: import.meta.glob('/src/assets/templates/minidyn/*'),
    },
  ]

  templateObjects.forEach(async (obj) => {
    const files = await Promise.all(
      Object.entries(obj.glob)
        .filter(([key]) => key.endsWith(extension))
        .map(async ([key, value]) => ({
          fileName: key.split('/').pop() || `file${extension}`,
          // TODO: Post merge change to RecordAny
          path: String(((await value()) as any).default),
        }))
    )

    const promises = []

    for (let i = 1; i <= files.length && i < 3; i++) {
      if (i === 1 || i === 2 || i === 3) {
        promises.push(setDemoFilesToLocalForage(files, i, obj.machine))
      }
    }

    await Promise.all(promises)
  })
}

const setDemoFilesToLocalForage = async (
  files: FileObject[],
  i: 1 | 2 | 3,
  machine: MachineName
) => {
  const fileInfo = files[i - 1]

  const key = getTemplateKey(machine, i)

  const file = await fetchFileFromURL(fileInfo.path)

  const current = await localForage.getItem(key)

  !current && (await localForage.setItem(key, file))
}
