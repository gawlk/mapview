import { Unzipped } from "fflate";
import { ExtendedBinaryReader } from "./ExtendedBinaryStream";
import ImpactDataFile from "./ImpactDataFile";

function loopPoints(points: MachinePoint[], impactDataFile: ImpactDataFile) {
    for (const point of points) {
        if (BigInt("0x" + point.id) === impactDataFile.ImpactDataHeader.pointId) {
            for (const index in point.drops) {
                point.drops[index].impactData = impactDataFile.ImpactDatas[index];
            }
        }
    }
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
        for (const report of project.reports.list) {
            loopPoints(report.line.sortedPoints, impactDataFile)
        }
    }
    console.log(project.reports.list.map(report => report.line.sortedPoints.map(point => point.drops.map(drop => drop.impactData))));
}