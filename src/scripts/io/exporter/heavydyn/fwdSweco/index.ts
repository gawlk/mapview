import dayjs from "dayjs"
import dedent from "dedent"
import { findFieldInArray } from '/src/scripts/entities'
import { ddToDms } from "/src/scripts/utils"

export class FWDSwecoExportStrategy implements ExportStrategy {
    extension: string = 'fwd'

    doExport(project: HeavydynProject): string {
        return (
            "\n" +
            this.writeHeader(project) +
            this.writePoints(project) +
            "\n"
        );
    }

    private writeSeparator(): string {
        return ''.padEnd(130, '_');
    }

    private padDotString(str: string, length: number, tab: boolean = true): string {
        const c = tab ? "\t" : "";
        return str.padEnd(length, '.') + c
    }

    private writeHeader(project: HeavydynProject): string {
        if (!project.reports.selected) {
            throw new Error('cannot find selected report ')
        }
        const date = dayjs(findFieldInArray(project.reports.selected.informations, 'Date')?.convertValueToString()).format('DD/MM/YYYY');
        const fwdNumber = findFieldInArray(project.hardware, 'Serial number')?.value;
        const dPlate = Math.round(project.calibrations.dPlate * 1000);
        const sensors = project.calibrations.channels.slice(1);

        return dedent`
            ${this.writeSeparator()}\n\n
            (c) ROAD SYSTEM 2016, Metric
            ${this.writeSeparator()}
            $1
            ${this.padDotString("Filename:", 23)}
            ${this.padDotString("Client Code:", 23)}
            ${this.padDotString("Road number:", 23)}
            ${this.padDotString("Name of Client:", 23)}
            ${this.padDotString("Districtnumber:", 23)}
            ${this.padDotString("Road reference:", 23)}
            ${this.padDotString("Start reference:", 23)}
            ${this.padDotString("Date [dd/mm/yy]:", 23) + date}
            ${this.padDotString("FWD Number:", 23) + fwdNumber}
            ${this.padDotString("Load plate radius [mm]", 23) + dPlate}
            ${' '.repeat(23) + '\t' + sensors.map((_, index) => `R(${index + 1})`).join('\t')}
            ${this.padDotString("Radial offset [cm]", 23) + sensors.map((channel) => Math.round(parseFloat(channel.position) * 100)).join('\t')}
            ${this.padDotString("Tolerance [%]", 23) + sensors.map(() => '5').join('\t')}
            ${this.padDotString("Correction [%]", 23) + sensors.map(() => '0').join('\t')}
            ${this.padDotString("Filter OFF:", 23)} - Hz
            \n\n
        `
    }

    private writePoints(project: HeavydynProject): string {
        return project.reports.selected?.line.sortedPoints.map((point) => {
            let coordinates = { lng: "", lat: "" }
            const chainage = Math.round(point.data.find((data) => data.label.name === 'Chainage')?.value.value || 0);
            if (point.marker) {
                coordinates = ddToDms(point.marker?.getLngLat());
            }
            const dropPosition = [
                "Position of Drop:",
                "Longitude: " + coordinates.lng,
                "Latitude: " + coordinates.lat,
                "Altitude: 0.0 m"
            ]
            return dedent`
                \n${this.writeSeparator()}
                $2
                ${this.padDotString("Chainage [m]", 23) + chainage}
                ${this.padDotString("Lane", 23)}
                ${this.padDotString("Pavement description", 23)}
                ${this.padDotString("Remarks", 23)}
                ${dropPosition.join('\t')}
                ${this.writeDrops(point, project.calibrations.channels)}
            `
        }).join('') || ""
    }

    private writeDrops(point: MachinePoint, channels: JSONChannel[]): string {
        const pointInfos = [
            "Sequence: 1/1",
            "No. of drops: " + point.drops.length.toString(),
            "Fallheight: 0", //TODO
            "Time: " + dayjs(point.date).format('HH:mm')
        ]
        const dropHeader = [
            "Drop",
            ...point.drops[0].data.slice(2).map((_, index) => `D(${index + 1})`),
            'kPa', 'kN', 'Air', 'Sur.', 'Man.', 'Pulse time'
        ]

        return dedent`
            ${this.writeSeparator()}
            $3
            ${pointInfos.join('\t')}
            
            ${dropHeader.join('\t')}
            ${point.drops.map(drop => this.writeDrop(drop, channels)).join('\n')}
        `
    }

    private writeDrop(drop: MachineDrop, channels: JSONChannel[]): string {
        if (!drop.impactData) {
            throw new Error("No impact data found");
        }
        const loadMax = drop.data[1].value.getValueAs("kN").toFixed(1);
        const loadPosition = Math.round(parseFloat(channels[0].position) * 100);
        const maxValues = [
            drop.index.displayedIndex,
            ...drop.data.slice(2).map(drop => drop.value.getValueAs('um').toFixed(1)),
            0,//todo ??
            loadMax,
            ...drop.point.data.slice(0, -1).map((data) => data.value.getLocaleString({ precision: 1, locale: "en-US" })),
            drop.data[0].value.getValueAs('ms').toFixed(2)
        ]
        const loadInfos = [
            this.padDotString(`LoadCell (${loadPosition})[kN]`, 23, false),
            '-',
            loadMax,
            ...drop.impactData?.load.map((value) => value.toFixed(4))
        ]

        return dedent`
            ${maxValues.join('\t')}
            ${loadInfos.join('\t')}
            ${this.writeDisplacements(drop, channels)}
        `
    }

    private writeDisplacements(drop: MachineDrop, channels: JSONChannel[]): string {
        if (!drop.impactData) {
            throw new Error("No impact data found");
        }
        return drop.impactData.displacement
            .map((displacement, index) => {
                const sensorName = "Sensor" + (index + 1).toString().padStart(2, ' ');
                const sensorPosition = `(${Math.round(parseFloat(channels[index + 1].position) * 100).toString().padStart(4, ' ')})`;
                const sensorData = [
                    sensorName + sensorPosition + "[MPa;µm].",
                    1.0, //TODO
                    drop.data[index + 2].value.getValueAs("um").toFixed(1),
                    ...displacement.map(val => (val * 1000000).toFixed(1).replace("-0.0", "0.0"))
                ];
                return sensorData.join('\t');
            }).join('\n');
    }

}