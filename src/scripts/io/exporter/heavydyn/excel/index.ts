import { getBrowserLocale } from "/src/locales"

export class ExcelExportStrategy implements ExportStrategy {
    extension: string = "json";

    public doExport(project: HeavydynProject): string {
        let res = this.createJson(project);
        return JSON.stringify(res);
    }

    private generateInformationsFromFields(fields: Field[], tag: string, labelKey: string = "label", valueKey: string = "value") {
        return fields.reduce((a, v) => {
            let label = this.toPascalCase(tag + "_" + v[labelKey]);
            let value = typeof v[valueKey] === "object" ? v[valueKey].value : v[valueKey];

            return {
                ...a,
                [label]: value
            }
        }, {});
    }


    //SHOULD BE AN UTIL
    private toPascalCase(str: string) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, '');
    }

    private generatePointData(points: MachinePoint[], labelPrefix: string) {
        return points.reduce((a, point) =>
            point.data.reduce((b, data) => {
                const label = this.toPascalCase(labelPrefix + data.label.name);
                const values = [...(b[label] || []), data.value.value];

                return {
                    ...b,
                    [label]: values
                }
            }, a), {}
        )
    }

    private generatePointInformations(points: MachinePoint[], labelPrefix: string) {
        return points.reduce((a, point) => ({
            ...point.information.reduce((b, information) => {
                const label = this.toPascalCase(labelPrefix + information.label);
                const value = typeof information.value === "object" ? information.value.value : information.value;
                const values = [...(b[label] || []), value]

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

    private generateDropData(points: MachinePoint[], labelPrefix: string) {
        return points.reduce((a, point) => {
            return point.drops.reduce((b, drop) => {
                return {
                    ...b,
                    ...drop.data.reduce((c, data) => {
                        const label = this.toPascalCase(labelPrefix + drop.index.displayedIndex + "_" + data.label.name);
                        const values = [...(c[label] || []), data.value.value];
                        return {
                            ...c,
                            [label]: values
                        }
                    }, b)
                }
            }, a)
        }, {})
    }

    private generateZoneData(zones: MachineZone[]) {
        return zones.reduce((a, zone, index) => {
            return {
                ...a,
                ["Z" + (index + 1) + "_Name"]: zone.name,
                ...this.generatePointInformations(zone.points, "Z" + (index + 1) + "_Pi_"),
                ...this.generatePointData(zone.points, "Z" + (index + 1) + "_Pi_"),
                ...this.generateDropData(zone.points, "Z" + (index + 1) + "_Pi_"),
            }
        }, {})
    }

    private generateUnits(units: MachineMathUnits) {
        return {
            ...Object.values(units).reduce((a, unit) => ({
                ...a,
                ["Unit_" + unit.name]: unit.currentUnit
            }), {})
        }
    }

    private generateThresholds(report: HeavydynReport) {
        const group = report.dataLabels.groups.selected
        if (!group || !group.choices.selected) return {};
        const mathNumber = report.line.sortedPoints[0].getSelectedMathNumber(
            group.from,
            group.choices.selected,
            group.indexes?.selected
        )
        const unit = mathNumber?.unit
        const threshold = Object.values(
            report.thresholds.groups
        ).find((group) => group.unit === unit)?.choices.selected

        console.log("threshold", threshold)
        return {
            "Threshold_Class": threshold?.name,
            "Threshold_Threshold": threshold?.value,
        }
    }

    public createJson(project: HeavydynProject) {
        if (!project.reports.selected)
            return;
        return {
            "JsonFileFormat": "Report database from Mapview",
            "Version": 1,
            "Database_Software": "Mapview",
            "Database_Local": getBrowserLocale(false),
            "Database_TimeZone": Intl.DateTimeFormat().resolvedOptions().timeZone, //TODO get current timeZone
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
            ...this.generateInformationsFromFields(project.information, "Project"),
            ...this.generateUnits(project.units),
            ...this.generateInformationsFromFields(project.hardware, "Hardware"),
            ...this.generateInformationsFromFields(project.reports.selected.information, "Report"),
            ...this.generateInformationsFromFields(project.reports.selected.platform, "Platform"),
            ...this.generateThresholds(project.reports.selected),
            ...this.generatePointInformations(project.reports.selected.line.sortedPoints, "Pi_"),
            ...this.generatePointData(project.reports.selected.line.sortedPoints, "Pi_"),
            ...this.generateDropData(project.reports.selected.line.sortedPoints, "Pi_D"),
            ...this.generateZoneData(project.reports.selected.zones),
        }
    }
}