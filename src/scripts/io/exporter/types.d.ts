interface ExportStrategy {
  extension: string
  doExport(project: MachineProject): string
}
