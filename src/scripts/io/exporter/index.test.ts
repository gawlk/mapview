import { assert, describe, expect, it, vi } from 'vitest'
import * as fs from 'fs'
import { Unzipped, unzipSync } from 'fflate'
import { convertJSONFromPRJZToMPVZ } from '../converter'
import { generateProjectFromJSON } from '../importer'
import { JSDOM } from 'jsdom'

const getProject = async () => {
  const buffer = fs.readFileSync(__dirname + '/MR.prjz')
  const zip = unzipSync(new Uint8Array(buffer))
  const jsonUint = zip['database.json']

  const importedJSON: any = JSON.parse(new TextDecoder().decode(jsonUint))
  const jsonProject = convertJSONFromPRJZToMPVZ(importedJSON)

  const project = await generateProjectFromJSON(jsonProject)
  return project
}

describe('suite name', () => {
  it('foo', async () => {
    const project = await getProject()
    console.log('project', project)
    expect(1 + 1).toEqual(2)
    expect(true).to.be.true
  })

  it('bar', () => {
    assert.equal(Math.sqrt(4), 2)
  })

  it('snapshot', () => {
    expect({ foo: 'bar' }).toMatchSnapshot()
  })
})
