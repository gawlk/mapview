import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { program } from 'commander'
import {
  heavydynDynatestExporter,
  heavydynF25Exporter,
  heavydynPDXExporter,
  heavydynSwecoExporter,
  importFile,
  loadMpvz,
  mpvzExporter,
  mvrzExporter,
} from 'dist/main'
import { Image as happyImage, Window } from 'happy-dom'

const _filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(_filename)

const io = `${_dirname}/../../../scripts/io`

const defaultExportFolder = `${io}/exporter/tests/files`
const defaultImportFolder = `${io}/importer/tests/files`

const acceptedExtension = ['pdx', 'f25', 'fwd', 'mpvz', 'mvrz']

if (typeof File === 'undefined') {
  global.File = class File extends Blob {
    lastModified = -1

    name = ''

    webkitRelativePath = ''

    constructor(
      fileBits: (string | ArrayBuffer | ArrayBufferView | Blob | Buffer)[],
      fileName: string,
      options?: FilePropertyBag,
    ) {
      super(fileBits, options)
      this.lastModified =
        (options && options.lastModified) || new Date().getDate()
      this.name = fileName.replace(/\//g, ':')
      this.webkitRelativePath = fileName
    }
  }
}

if (typeof window === 'undefined') {
  const window = new Window()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.window = window
}

if (typeof Image === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  global.Image = happyImage
}

program
  .name('updater')
  .description('CLI to update reference file of the CI')
  .version('0.0.1')
  .arguments('[path]')
  .option('-f --file', 'update only the file give as path')
  .option('--import', 'update reference mpvz of the default import folder')
  .option(
    '--ignore <name>',
    'folder to ignore',
    (value: string, previous: string[]) => previous.concat([value]),
    ['retroCompatibility'],
  )
  .parse()

const opts = program.opts()

const projects: Map<string, HeavydynProject> = new Map()

const loadProject = async (subPath: string, name: string) => {
  const projectBlob = new Blob([readFileSync(subPath)])

  const projectFile = new File([await projectBlob.arrayBuffer()], name)

  const project = (await importFile(projectFile)) as HeavydynProject

  projects.set(subPath, project)

  await loadMpvz(projectFile, project)

  return project
}

const updateRefFile = async (
  currentPath: string,
  options?: { ignoreMpvz?: boolean },
) => {
  const dirPath = path.dirname(currentPath)
  const name = path.basename(currentPath)
  const extension = String(path.extname(currentPath))
    .toLowerCase()
    .replace('.', '')

  const folders = readdirSync(dirPath)

  const mpvzFileName = folders.find((fileName) => {
    return path.extname(fileName).toLowerCase().includes('mpvz')
  })

  if (!mpvzFileName) {
    console.error('no mpvz file found')
    return
  }

  const subPath = `${dirPath}/${mpvzFileName}`
  const stats = statSync(subPath)

  console.log(`preparing to update ${currentPath}`)

  if (!stats.isFile()) {
    console.error("can't load mpvz")
    return
  }

  let project = projects.get(subPath)

  if (!project) {
    console.log('preparing project')
    project = await loadProject(subPath, mpvzFileName)
  } else {
    console.log('load project')
  }

  let exportedFile

  if (extension === 'mpvz' && options?.ignoreMpvz) {
    console.log('ignore mpvz', subPath)
    return
  }

  switch (extension) {
    case 'f25':
      exportedFile = heavydynF25Exporter.export(project)
      break
    case 'fwd':
      if (name.includes('sweco')) {
        exportedFile = heavydynSwecoExporter.export(project)
      } else if (name.includes('dynatest')) {
        exportedFile = heavydynDynatestExporter.export(project)
      }
      break
    case 'pdx':
      exportedFile = heavydynPDXExporter.export(project)
      break
    case 'mvrz':
      exportedFile = await mvrzExporter.export(project)
      break
    case 'mpvz':
      exportedFile = await mpvzExporter.export(project)
  }

  if (!exportedFile) {
    console.error(`file extension not managed ${extension}`)
    return
  }

  writeFileSync(currentPath, new DataView(await exportedFile.arrayBuffer()))
}

const updateRefFolder = async (
  directories: string[] = [defaultExportFolder],
) => {
  if (
    !directories.every((dir) => {
      const stats = statSync(dir)

      return stats.isDirectory()
    })
  ) {
    console.error("some path aren't folder")
    return
  }

  console.log('Loading files to update...')

  const dirs: string[] = [...directories]
  const files: string[] = []
  const mpvz: string[] = []
  let index = 0

  while (index < dirs.length) {
    const dir = dirs[index]
    const subElement = readdirSync(dir)

    subElement.forEach((elt) => {
      const eltPath = `${dir}/${elt}`
      const stats = statSync(eltPath)

      const ext = path.extname(eltPath).toLowerCase().replace('.', '')

      if (stats.isDirectory()) {
        dirs.push(eltPath)
      } else if (stats.isFile() && acceptedExtension.includes(ext)) {
        files.push(eltPath)
        if (ext === 'mpvz') {
          mpvz.push(eltPath)
        }
      }
    })

    index += 1
  }

  console.log(`${files.length} files found`)

  const promises: Promise<HeavydynProject>[] = []

  mpvz.forEach((m) => {
    promises.push(loadProject(m, path.basename(m)))
  })

  await Promise.all(promises)

  await Promise.all(
    files.map((file) => {
      return updateRefFile(
        file,
        opts.ignore.some((folder: string) => file.includes(folder))
          ? { ignoreMpvz: true }
          : undefined,
      )
    }),
  )
}

const args = program.args

if (opts.file) {
  void updateRefFile(args[0])
} else {
  await updateRefFolder([
    opts.import ? defaultImportFolder : defaultExportFolder,
  ])
}
