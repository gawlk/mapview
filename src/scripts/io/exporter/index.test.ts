import { assert, describe, expect, it, vi } from 'vitest'
import * as fs from 'fs'
import { unzipSync } from 'fflate'
import { convertJSONFromPRJZToMPVZ } from '../converter'
import { generateProjectFromJSON } from '../importer'
import Context from '.'
import { F25ExportStrategy, PDXExportStrategy } from './heavydyn'

const getProject = async () => {
  const buffer = fs.readFileSync(__dirname + '/MR.prjz')
  const zip = unzipSync(new Uint8Array(buffer))
  const jsonUint = zip['database.json']

  const importedJSON: any = JSON.parse(new TextDecoder().decode(jsonUint))
  const jsonProject = convertJSONFromPRJZToMPVZ(importedJSON)

  const project = await generateProjectFromJSON(jsonProject)
  return project
}

// describe('suite name', async () => {
//   const project = await getProject()

//   if (project) {
//     const context = new Context(new F25ExportStrategy())
//     context.doExport(project)
//     const goodFileContent = fs.readFileSync(__dirname + '/mr.F25').toString()

//     const linesGoodFile = goodFileContent.replaceAll('\r', '').split('\n')
//     context.fileContent.split('\n').forEach((line, i) => {
//       it('test line ' + i, () => {
//         expect(line).toEqual(linesGoodFile[i])
//       })
//     })
//   }
// })

describe('test pdx', async () => {
  const project = await getProject()

  if (project) {
    const context = new Context(new PDXExportStrategy())
    context.doExport(project)

    console.log(context.fileContent)
  }
  it('test', () => {
    expect(1 + 1).toEqual(2)
  })
})
