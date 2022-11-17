export default class ImpactSetData {
  public ID: bigint = BigInt(0)
  public ImpactDatas: ImpactData[] = []

  get numberOfImpact(): number {
    return this.ImpactDatas.length
  }

  get numberOfSamples(): number {
    if (!this.numberOfImpact) {
      return 0
    }
    return this.ImpactDatas[0].load.length
  }

  get numberOfDisplacement(): number {
    if (!this.numberOfImpact || !this.ImpactDatas[0].displacement) {
      return 0
    }
    return this.ImpactDatas[0].displacement[0].length
  }
}
