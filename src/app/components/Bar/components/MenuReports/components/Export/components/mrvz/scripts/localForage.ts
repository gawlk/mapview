import localForage from 'localforage'

import { convertFileToDataURL, fetchFileFromURL } from '/src/scripts'

export const getTemplateKey = (machine: MachineName, number: 1 | 2 | 3) =>
  `template${machine.toLowerCase()}${number}`

export const initDemoTemplates = () => {
  const extension = '.xlsx'

  const templateObjects: {
    machine: MachineName
    glob: Record<string, () => Promise<unknown>>
  }[] = [
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
        .filter(([key, _]) => key.endsWith(extension))
        .map(async ([key, value]) => ({
          fileName: key.split('/').pop() || `file${extension}`,
          path: String(((await value()) as any).default),
        }))
    )

    for (let i = 1; i <= files.length && i < 3; i++) {
      if (i === 1 || i === 2 || i === 3) {
        const fileInfo = files[i - 1]

        const key = getTemplateKey(obj.machine, i)

        const file = await fetchFileFromURL(fileInfo.path)

        const current = await localForage.getItem(key)

        !current &&
          localForage.setItem(key, {
            name: fileInfo.fileName,
            data64: await convertFileToDataURL(file),
          })
      }
    }
  })
}
