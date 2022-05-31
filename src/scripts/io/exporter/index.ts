import FileSaver from 'file-saver'

export * from './prjz'

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
    FileSaver.saveAs(
      new Blob([this.fileContent]),
      'report.' + this.strategy.extension
    )
  }
}
