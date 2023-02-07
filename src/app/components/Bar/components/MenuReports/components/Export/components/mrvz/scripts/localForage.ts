import localForage from 'localforage'

import { convertFileToDataURL, fetchFileFromURL } from '/src/scripts'

export const getTemplateKey = (machine: MachineName, number: 1 | 2 | 3) =>
  `template${machine.toLowerCase()}${number}`

export const initDemoTemplates = () => {
  const templateObjects: {
    machine: MachineName
    glob: Record<string, () => Promise<unknown>>
  }[] = [
    {
      machine: 'Heavydyn',
      glob: import.meta.glob('/src/assets/templates/heavydyn/*', {
        as: 'url',
      }),
    },
    {
      machine: 'Maxidyn',
      glob: import.meta.glob('/src/assets/templates/maxidyn/*', {
        as: 'url',
      }),
    },
    {
      machine: 'Minidyn',
      glob: import.meta.glob('/src/assets/templates/minidyn/*', {
        as: 'url',
      }),
    },
  ]

  templateObjects.forEach(async (obj) => {
    const paths = Object.keys(obj.glob).filter((path) => path.endsWith('.xlsx'))

    for (let i = 1; i < paths.length && i < 3; i++) {
      if (i === 1 || i === 2 || i === 3) {
        const key = getTemplateKey(obj.machine, i)

        const file = await fetchFileFromURL(paths[i - 1])

        const current = await localForage.getItem(key)

        !current &&
          localForage.setItem(key, {
            name: file.name,
            data64: await convertFileToDataURL(file),
          })
      }
    }
  })
}
