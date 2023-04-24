interface MPVZTestData {
  file: File
  project: MachineProject | null
}

// key's is built with files extension
interface ReportTestExportData {
  directoryName: string
  pdx: File
  mvrz: File
  fwdDynatest: File
  fwdSweco: File
  f25: File
  mpvz: MPVZTestData
}
