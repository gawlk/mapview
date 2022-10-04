import { Unzipped } from "fflate";
import { ExtendedBinaryReader } from "./ExtendedBinaryStream";
import ImpactDataFile from "./ImpactDataFile";

function findReport(reports: MachineReport[], impactDataFile: ImpactDataFile, id: string) {
    reports.forEach(a => {
        let findPoint = a.line.sortedPoints.find(point => point.id === id)
        if (findPoint) {
            for (const index in findPoint.drops) {
                findPoint.drops[index].impactData = impactDataFile.ImpactDatas[index];
            }
        }
    })
}

export default function importRawData(zip: Unzipped, project: MachineProject) {
    const folderName = "Rawdata";
    const rawData = Object.keys(zip)
        .filter((key) => key.startsWith(folderName))
        .map((key) => key.substring(folderName.length + 1))
    for (const filename of rawData) {
        let file = zip[folderName + "\\" + filename].buffer
        const reader = new ExtendedBinaryReader(file);
        const impactDataFile = new ImpactDataFile();

        impactDataFile.loadFromFile(reader);
        findReport(project.reports.list, impactDataFile, filename);
    }
    console.log(project.reports.list.map(report => report.line.sortedPoints.map(point => (point.drops.map(drop => drop.impactData)))));
}