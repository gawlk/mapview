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
             // TODO: create generic function to fetch value from field
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
                const value = data.value.getValueAs(data.label.unit.currentUnit);
                const values = [... (b[label] || []) as number[], value];

                return {
                    ...b,
                    [label]: values
                }
            }, a), {}
        )
    }

    private generatePointInformations(points: MachinePoint[], labelPrefix: string) {
        return points.reduce<FlatDataJson>((a, point) => ({
            ...point.information.reduce<FlatDataJson>((b, information) => {
                const label = labelPrefix + this.toPascalCase(information.label);
                // TODO: create generic function to fetch value from field
                const value = typeof information.value === "object" ? information.value.value : information.value;
                const values = [...(b[label] || []), value];

                return {
                    ...b,
                    [label]: values as number[] | string[] | boolean[]
                }
            }, a),
            [labelPrefix + "ID"]: [...(a[labelPrefix + "ID"] || []) as string[], point.id],
            [labelPrefix + 'Number']: [...(a[labelPrefix + "Number"] || []) as number[], point.number],
            [labelPrefix + 'Date']: [...(a[labelPrefix + "Date"] || []) as string[], point.date.toISOString()],
            [labelPrefix + 'Longitude']: [...(a[labelPrefix + "Longitude"] || []) as number[], point.marker?.getLngLat().lng || 0],
            [labelPrefix + 'Latitude']: [...(a[labelPrefix + "Latitude"] || []) as number[], point.marker?.getLngLat().lat || 0],
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
                        const values = (c[label] || []) as number[];

                        values.push(data.value.getValueAs(data.label.unit.currentUnit));
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
        return Object.values(units).reduce<ExcelJson>((a, unit: MathUnit<string>) => ({
            ...a,
            ["Unit_" + unit.name]: unit.currentUnit
        }), {})
    }

    private generateThresholds(thresholds: MachineReportThresholds): ExcelJson {
        return Object.values(thresholds.groups).reduce<ExcelJson>((a, group: GroupedThresolds<string>) => {
            if (group.choices.selected) {
                return {
                    ...a,
                    ["Thresholds_" + group.unit.name + "_Kind"]: group.choices.selected.kind,
                    ["Thresholds_" + group.unit.name + "_Name"]: group.choices.selected.name,
                    ["Thresholds_" + group.unit.name + "_Value"]: group.choices.selected.value,
                }
            }
            return a;
        }, {});
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