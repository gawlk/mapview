import fs, { statSync } from 'fs'
import path from 'path'
import { program } from 'commander'
import {
  heavydynDynatestExporter,
  heavydynF25Exporter,
  heavydynPDXExporter,
  heavydynSwecoExporter,
  importFile,
  mpvzExporter,
  mvrzExporter,
} from 'dist/main'

// const _filename = fileURLToPath(import.meta.url)
// const _dirname = path.dirname(_filename)

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

program
  .name('updater')
  .description('CLI to update reference file of the CI')
  .version('0.0.1')
  .arguments('<path>')
  .option('--test')
  .parse()

const writeFile = async (filePath: string, file: File) => {
  fs.writeFileSync(filePath, new DataView(await file.arrayBuffer()))
}

const updateRefFile = async () => {
  // const options = program.opts()
  const arg = program.args
  const currentPath = arg[0]

  console.log(currentPath, arg, process.argv)

  const dirPath = path.dirname(currentPath)
  const name = path.basename(currentPath)
  const extension = String(path.extname(currentPath))
    .toLowerCase()
    .replace('.', '')

  console.log(name, extension)

  const folders = fs.readdirSync(dirPath)

  const mpvzFileName = folders.find((fileName) => {
    return path.extname(fileName).toLowerCase().includes('mpvz')
  })

  if (!mpvzFileName) {
    console.error('no mpvz file found')
    return
  }

  const subPath = `${dirPath}/${mpvzFileName}`
  const stats = statSync(subPath)

  if (!stats.isFile()) {
    console.error("can't load mpvz")
    return
  }

  const projectBlob = new Blob([fs.readFileSync(subPath)])

  const projectFile = new File([await projectBlob.arrayBuffer()], mpvzFileName)

  const project = (await importFile(projectFile)) as HeavydynProject

  project?.addToMap()

  let exportedFile

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

  await writeFile(currentPath, exportedFile)
}

void updateRefFile()
