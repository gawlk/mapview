import dedent from 'dedent'
import { findFieldInArray } from '/src/scripts/entities'

export class FWDExportStrategy implements ExportStrategy {
  extension: string = 'fwd'

  doExport(project: HeavydynProject): string {
    const fileString = `${this.writeHeader(project)}\n${this.writeEndHeader()}`

    return fileString
      .split('\n')
      .map((line) => line.padEnd(80, ' '))
      .join('\n')
  }

  public writeSensors(project: HeavydynProject): string[] {
    const sections = []
    const startIndex = project.calibrations.channels
      .slice(1, project.calibrations.channels.length)
      .findIndex((sensor) => Number(sensor.position) >= 0)

    const firstsSensors = project.calibrations.channels.slice(
      startIndex + 1,
      startIndex + 8
    )
    firstsSensors.unshift(project.calibrations.channels[0])

    sections.push(
      `${firstsSensors
        .map((sensor) =>
          Math.round(Number(sensor.position) * 1000)
            .toString()
            .padStart(4, ' ')
        )
        .join('')}${firstsSensors
        .map((sensor) =>
          (Number(sensor.position) * 0.0393701)
            .toFixed(2)
            .toString()
            .padStart(6, ' ')
        )
        .join('')}`
    )

    sections.push(
      firstsSensors
        .map((sensor, index) => {
          const name = index === 0 ? 'Ld' : 'D' + index
          return dedent`
          ${name} ${sensor.name.slice(
            sensor.name.length - 3,
            sensor.name.length
          )} 1.000 ${sensor.gain.toFixed(2)}
        `
        })
        .join('\n')
    )

    return sections
  }

  public writeHeader(project: HeavydynProject) {
    const stringArray = []
    const serialNumber = findFieldInArray(
      project.hardware,
      'Serial number'
    )?.convertValueToString()

    const sensorsSection = this.writeSensors(project)

    stringArray.push(dedent`
      R80    102    ${project.name.value}
      70103300${serialNumber}69994.3703111  1
    `)

    stringArray.push(sensorsSection[0])

    stringArray.push(
      '   R  D1  D2  D3  D4  D5  D6  D7     R    D1    D2    D3    D4    D5    D6    D7'
    )

    stringArray.push(dedent`
      12394260276336160       .302
      8   15  3.5 15  3   20  3   10
    `)

    stringArray.push(sensorsSection[1])

    return stringArray.join('\n')
  }

  public writeEndHeader() {
    return dedent`
      D0NA 0.0000.000
      D0NA 0.0000.000                                                            
      D0NA 0.0000.000
      D0NA 0.0000.000                                                             
      *                                                                               
      11110011........................                                                
      13.82   2.5 2    ...............                                                
      *                                                                               
      *                                                                               
      *                                                                               
      *000+0.0 000+0.0 st                                                             
      ................................                                                
                          0   0Peak...32  0   ......                                  
      123.............................................................................
      11111111111111111111111111111111111111111111111111111111111111111111111111111111
      ................................................................................
      ********************************************************************************
      ................................................................................
      ................................................................................
      *                                                                               
      *                                                
    `
  }
}
