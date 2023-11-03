import fs, { statSync } from 'fs'
import path from 'path'
import { program } from 'commander'
import { heavydynF25Exporter, importFile } from 'dist/main'

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
  .parse()

const updateRefFile = async () => {
  // const options = program.opts()
  const arg = program.args
  const currentPath = arg[0]

  const dirPath = path.dirname(currentPath)
  const extension = String(path.extname(currentPath))
    .toLowerCase()
    .replace('.', '')

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

  const mpvzBlob = new Blob([fs.readFileSync(subPath)])

  const mpvzFile = new File([await mpvzBlob.arrayBuffer()], mpvzFileName)

  const project = await importFile(mpvzFile)

  // console.log(extension)

  switch (extension) {
    case 'f25':
      {
        const f25 = heavydynF25Exporter.export(project as HeavydynProject)
        console.log(await f25.text())
      }
      break
  }
}

void updateRefFile()
