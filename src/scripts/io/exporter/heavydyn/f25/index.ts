import { saveAs } from 'file-saver'
export class F25ExportStrategy implements ExportStrategy {
  /**
   */
  public doExport(project: MachineProject): string {
    let header = this.writeHeader(project)
    return header
  }

  public writeHeader(project: MachineProject): string {
    const serialNumber = project.hardware.find(
      (machineField: MachineField) => machineField.label === 'Serial number'
    )
    const date = new Date(
      (
        project.informations.find(
          (machineField: MachineField) => machineField.label === 'Date'
        )?.value as SelectableString
      ).value
    )

    return `
    5001,25.99,1,40, 3, 1,"Heavydyn     "
    5002,"25SI ","${serialNumber?.value}","${serialNumber?.value}"
    5003, "${8}", "${8}", "${project.name.value}", "F25"
    5010,0,0,0,0,0,0,0,3,1,0,0,0,0,0,1,0,0,0,0,0,1,"MDB"
    5011,0,1,${date.getFullYear()},${date.getMonth()},${date.getDay()},${date.getHours()},${date.getMinutes()},0,"Non",000
    `
  }

  public writeEndHeader(project: MachineProject): string {
    return `
    5030,"${-32}"
    5031,"${-32}"
    5032,"${-32}"
    5301,0,1,3,3,   6.000,1,1,        ,2018,07,25,10,22
    5302, 0, 1, 8, 0, 0, 0, 0, 0, "          "
    5303, 0, N0, 33.6, 27.3
    5041, "                "
    5042, "                "
    5043, "                "
    5044, "                "
       `
  }

  public writePointHeader(project: MachineProject): string {
    const date = new Date(
      (
        project.informations.find(
          (machineField: MachineField) => machineField.label === 'Date'
        )?.value as SelectableString
      ).value
    )

    return `
    5301,0,1,3,3,${2},1,1,        ,${date.getFullYear()}, ${date.getMonth()}, ${date.getDay()}, ${date.getHours()}, ${date.getMinutes()}
    5302, 0, 1, 8, 0, 0, 0, 0, 0, "${55}"
    5303,0,${1},${5},${5}
    `
  }

  public save(stringToSave: string): void {
    const blob = new Blob([stringToSave], { type: 'F25' })
    saveAs(blob, 'test.F25')
  }
}
