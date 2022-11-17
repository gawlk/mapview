export * from './project'
export * from './report'

// import FileSaver from 'file-saver'

// public doExport(project: MachineProject): void {
//   this.fileContent = this.strategy.doExport(project).replaceAll('\n', '\r\n')

//   const blob = new Blob([this.fileContent], { type: 'text/plain' })

//   FileSaver.saveAs(blob, 'report.' + this.strategy.extension)
// }
