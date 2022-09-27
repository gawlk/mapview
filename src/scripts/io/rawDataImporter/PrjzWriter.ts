import ImpactSetData from "./ImpactSetData";

export default class PrjzWriter {

    private jsonDbWriter!: object;
    private impactEnumerable: Set<ImpactSetData> = new Set<ImpactSetData>();

    constructor() {}

    public save(filename: string, dropModified: boolean) {}

    private saveDatabase() {}

    private saveImpacts() {}

    private saveImpactFile() {}

    private entryExist() {}

    private deleteEntry() {}

}