import { ImpactData } from "./types";

export default class ImpactSetData {
    public ID: number = 0;
    public ImpactDatas: ImpactData[] = [];

    get numberOfImpact() {
        return this.ImpactDatas.length;
    }

    get numberOfSamples() {
        if (!this.numberOfImpact) {
            return 0;
        }
        return this.ImpactDatas[0].load.length;
    }

    get numberOfDisplacement() {
        if (!this.numberOfImpact || !this.ImpactDatas[0].displacement) {
            return 0;
        }
        return this.ImpactDatas[0].displacement[0].length;
    }
}