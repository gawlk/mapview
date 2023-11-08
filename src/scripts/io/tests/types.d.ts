interface ProjectTestData {
  file: File
  project: MachineProject | null
}

// key's is built with files extension
interface ReportTestExportData {
  directoryName: string
  f25: File
  fwdDynatest: File
  fwdSweco: File
  mpvz: ProjectTestData
  mvrz: File
  pdx: File
  prjz: ProjectTestData
}
