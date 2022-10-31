import { getBrowserLocale } from "/src/locales"

export class ExcelExportStrategy implements ExportStrategy {
    extension: string = "json";

    public doExport(project: HeavydynProject): string {
        let res = this.createJson(project);
        return JSON.stringify(res, null, 4);
    }

    private generateInformationsFromFields(fields: Field[], tag: string): ExcelJson {
        return fields.reduce<ExcelJson>((a, v) => {
            let label = tag + this.toPascalCase(v.label);
            let value = typeof v.value === "object" ? v.value.value : v.value;

            return {
                ...a,
                [label]: value
            }
        }, {});
    }

    //Replace to sanitize excel
    private toPascalCase(str: string): string {
        return str
            .replace(/-/g, "M")
            .replace(/_/g, " ")
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, '');
    }

    private generatePointData(points: MachinePoint[], labelPrefix: string): ExcelJson {
        return points.reduce<FlatDataJson>((a, point) =>
            point.data.reduce<FlatDataJson>((b, data) => {
                const label = labelPrefix + this.toPascalCase(data.label.name);
                let values = b[label] || [];

                values = <typeof values>[...values, data.value.getValueAs(data.label.unit.currentUnit)];

                return {
                    ...b,
                    [label]: values
                }
            }, a), {}
        )
    }

    private generatePointInformations(points: MachinePoint[], labelPrefix: string) {
        return points.reduce((a, point) => ({
            ...point.information.reduce<FlatDataJson>((b, information) => {
                const label = labelPrefix + this.toPascalCase(information.label);
                const value = typeof information.value === "object" ? information.value.value : information.value;
                let values = b[label] || []
                values = <typeof values>[...values, value]

                return {
                    ...b,
                    [label]: values
                }
            }, a),
            [labelPrefix + 'ID']: [...(a[labelPrefix + "ID"] || []), point.id],
            [labelPrefix + 'Number']: [...(a[labelPrefix + "Number"] || []), point.number],
            [labelPrefix + 'Date']: [...(a[labelPrefix + "Date"] || []), point.date],
            [labelPrefix + 'Longitude']: [...(a[labelPrefix + "Longitude"] || []), point.marker?.getLngLat().lng],
            [labelPrefix + 'Latitude']: [...(a[labelPrefix + "Latitude"] || []), point.marker?.getLngLat().lat],
        }), {})
    }

    private generateDropData(points: MachinePoint[], labelPrefix: string): ExcelJson {
        return points.reduce<FlatDataJson>((a, point) => {
            const drops: MachineDrop[] = point.drops;
            return drops.reduce<FlatDataJson>((b, drop) => {
                return {
                    ...b,
                    ...drop.data.reduce<FlatDataJson>((c, data) => {
                        const label = labelPrefix + drop.index.displayedIndex + "_" + this.toPascalCase(data.label.name);
                        let values = c[label] || []
                        values = <typeof values>[...values, data.value.getValueAs(data.label.unit.currentUnit)]
                        return {
                            ...c,
                            [label]: values
                        }
                    }, b)
                }
            }, a)
        }, {})
    }

    private generateZoneData(zones: MachineZone[]): ExcelJson {
        return zones.reduce<ExcelJson>((a, zone, index) => {
            return {
                ...a,
                ["Z" + (index + 1) + "_Name"]: zone.name,
                ...this.generatePointInformations(zone.points, "Z" + (index + 1) + "_Pi_"),
                ...this.generatePointData(zone.points, "Z" + (index + 1) + "_Pi_"),
                ...this.generateDropData(zone.points, "Z" + (index + 1) + "_Pi_D"),
            }
        }, {})
    }

    private generateUnits(units: MachineMathUnits): ExcelJson {
        return Object.values(units).reduce<ExcelJson>((a, unit) => ({
            ...a,
            ["Unit_" + unit.name]: unit.currentUnit
        }), {})
    }

    private generateThresholds(thresholds: MachineReportThresholds): ExcelJson {
        return Object.values(thresholds.groups).reduce<ExcelJson>((a, group) => ({
            ...a,
            ["Thresholds_" + group.unit.name + "_Kind"]: group.choices.selected.kind,
            ["Thresholds_" + group.unit.name + "_Name"]: group.choices.selected.name,
            ["Thresholds_" + group.unit.name + "_Value"]: group.choices.selected.value,
        }), {});
    }

    public createBaseJson(project: BaseProject): ExcelJson {
        if (!project.reports.selected)
            return {};
        return {
            "JsonFileFormat": "Report database from Mapview",
            "Version": 1,
            "Database_Software": "Mapview",
            "Database_Local": getBrowserLocale(false) || "NA",
            "Database_TimeZone": Intl.DateTimeFormat().resolvedOptions().timeZone,
            "Database_Iterators_Name": [
                "Z",
                "P",
                "D"
            ],
            "Database_Iterators_Optional": [
                true,
                false,
                false
            ],
            "Database_Iterators_FixedSize": [
                true,
                false,
                true
            ],
            "Database_Iterators_DirectAdressing": [
                true,
                false,
                true
            ],
            ...this.generateInformationsFromFields(project.information, "Project_"),
            ...this.generateInformationsFromFields(project.hardware, "Hardware_"),
            ...this.generateInformationsFromFields(project.reports.selected.information, "Report_"),
            ...this.generateInformationsFromFields(project.reports.selected.platform, "Platform_"),
            ...this.generateUnits(project.units),
            ...this.generateThresholds(project.reports.selected.thresholds)
        }
    }

    public createJson(project: HeavydynProject): ExcelJson {
        if (!project.reports.selected)
            return {};
        return {
            ...this.createBaseJson(project),
            ...this.generatePointInformations(project.reports.selected.line.sortedPoints, "Pi_"),
            ...this.generatePointData(project.reports.selected.line.sortedPoints, "Pi_"),
            ...this.generateDropData(project.reports.selected.line.sortedPoints, "Pi_D"),
            ...this.generateZoneData(project.reports.selected.zones),
        }
    }
}