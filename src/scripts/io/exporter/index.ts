import FileSaver from 'file-saver'

export * from './prjz'
export * from './heavydyn'

export default class Context {
  public fileContent: string
  private strategy: ExportStrategy

  constructor(strategy: ExportStrategy) {
    this.strategy = strategy
    this.fileContent = ''
  }

  public setStrategy(strategy: ExportStrategy) {
    this.strategy = strategy
  }

  public doExport(project: MachineProject): void {
    this.fileContent = this.strategy.doExport(project)
    let blob
    if (typeof Blob === 'undefined' || !Blob) {
      blob = new (require('buffer').Blob)([this.fileContent], {
        type: 'text/plain',
      })
    } else {
      blob = new Blob([this.fileContent], { type: 'text/plain' })
    }
    FileSaver.saveAs(blob as Blob, 'report.' + this.strategy.extension)
  }
}
