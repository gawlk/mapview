import { readFileSync } from 'fs'
import { beforeAll, describe, expect, it } from 'vitest'

import { importFile } from '/src/scripts'

import { heavydynPDXExporter } from '../report/heavydyn/pdx'
import { testFile } from './fileVerifier.test'

let project: Awaited<ReturnType<typeof importFile>>

export const getFileFromPath = async (path: string) => {
  const url = `${__dirname}${path}`

  const buffer = readFileSync(url)

  return new File([buffer], path.split('/').pop() as string)
}

describe('Test exports', async () => {
  beforeAll(async () => {
    console.log('before')
    const fileToImport = await getFileFromPath('/files/Demo_Heavydyn_FR.mpvz')

    const prjt = await importFile(fileToImport)

    expect(prjt).toBeDefined()

    if (prjt) {
      project = prjt
    }
    console.log('end before')
  })

  console.log('project', typeof project)

  it('test pdx', async () => {
    console.log('test pdx', typeof project)
    const pdxFile = await heavydynPDXExporter.export(project as HeavydynProject)
    expect(pdxFile).toBeDefined()
    testFile(pdxFile)
  })
})
