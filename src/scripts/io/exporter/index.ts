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
    this.fileContent = this.strategy.doExport(project).replaceAll('\n', '\r\n')

    const blob = new Blob([this.fileContent], { type: 'text/plain' })

    FileSaver.saveAs(blob, 'report.' + this.strategy.extension)
  }
}
