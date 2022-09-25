export enum IsaanSimpleFileType {
    ImpactDataFile = 0x8D937355
}

interface ImpactData {
    load: number[];
    displacement: number[][];
}
