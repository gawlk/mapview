export * from './prjz'

class Context {
  private strategy: ExportStrategy

  constructor(strategy: ExportStrategy) {
    this.strategy = strategy
  }

  public setStrategy(strategy: ExportStrategy) {
    this.strategy = strategy
  }

  public doExport(project: MachineProject): void {
    const fileString = this.strategy.doExport(project)
    // save
  }
}
