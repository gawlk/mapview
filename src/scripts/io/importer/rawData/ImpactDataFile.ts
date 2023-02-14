import { ExtendedBinaryReader } from './ExtendedBinaryStream'
import ImpactSetData from './ImpactSetData'

enum IsaanSimpleFileType {
  ImpactDataFile = 0x8d937355,
}

class SimpleFileStreamable {
  protected maxSupportedVersion!: number
  protected objectVersion!: number

  public fromStream(br: ExtendedBinaryReader): void {
    this.objectVersion = br.readInt32()
    if (this.objectVersion > this.MaxSupportedVersion) {
      throw new Error('Version not supported')
    }
  }

  get MaxSupportedVersion(): number {
    return this.maxSupportedVersion
  }

  get ObjectVersion(): number {
    return this.objectVersion
  }
}

class IsaanSimpleFileHeader extends SimpleFileStreamable {
  private FILE_MAGIC: string = 'ISAANSIMPLEFILE'
  public fileType!: IsaanSimpleFileType
  public fileVersion!: number

  constructor() {
    super()
    this.maxSupportedVersion = 1
    this.objectVersion = this.maxSupportedVersion
  }

  public fromStream(br: ExtendedBinaryReader): void {
    super.fromStream(br)

    const magic: string = br.readString()

    if (magic != this.FILE_MAGIC) throw new Error('Not a Isaan simple file')

    this.fileType = br.readUInt32() as IsaanSimpleFileType
    this.fileVersion = br.readInt32()
  }
}

class ImpactDataHeader extends SimpleFileStreamable {
  public pointId!: bigint
  public nbSamples!: number
  public nbOfImpact!: number
  public nbOfDisplacement!: number
  // public frequency!: number

  constructor() {
    super()
    this.maxSupportedVersion = 1
  }

  public fromStream(br: ExtendedBinaryReader): void {
    super.fromStream(br)
    this.pointId = br.readInt64()
    this.nbSamples = br.readInt32()
    this.nbOfImpact = br.readInt32()
    this.nbOfDisplacement = br.readInt32()
    // this.frequency = br.readFloat32()
  }
}

export default class ImpactDataFile {
  private fileHeader: IsaanSimpleFileHeader
  private impactDataHeader: ImpactDataHeader
  private impactDatas: ImpactData[]
  private maxSupportedVersion: number = 1

  get ImpactDataHeader(): ImpactDataHeader {
    return this.impactDataHeader
  }

  get ImpactDatas(): ImpactData[] {
    return this.impactDatas
  }

  constructor(impactSetData?: ImpactSetData) {
    this.fileHeader = new IsaanSimpleFileHeader()
    this.fileHeader.fileType = IsaanSimpleFileType.ImpactDataFile
    this.fileHeader.fileVersion = this.maxSupportedVersion
    this.impactDataHeader = new ImpactDataHeader()
    this.impactDatas = new Array<ImpactData>()

    if (impactSetData) {
      this.impactDataHeader.pointId = impactSetData.ID
      this.impactDataHeader.nbSamples = impactSetData.numberOfSamples
      this.impactDataHeader.nbOfImpact = impactSetData.numberOfImpact
      this.impactDataHeader.nbOfDisplacement =
        impactSetData.numberOfDisplacement
      this.impactDatas = impactSetData.ImpactDatas
    }
  }

  public loadFromFile(br: ExtendedBinaryReader): void {
    this.fileHeader.fromStream(br)

    if (this.fileHeader.fileType !== IsaanSimpleFileType.ImpactDataFile) {
      throw new Error('Not a ImpactDataFile')
    }

    if (this.fileHeader.fileVersion > this.maxSupportedVersion) {
      throw new Error('Version not supported')
    }

    this.impactDataHeader = new ImpactDataHeader()

    this.impactDataHeader.fromStream(br)

    this.impactDatas = new Array(this.impactDataHeader.nbOfImpact)

    for (let i = 0; i < this.impactDataHeader.nbOfImpact; i++) {
      const load = br.readArrayDouble()

      const displacement = br.readTwoDimensionArraySingleAsDouble()

      const impactData: ImpactData = {
        load,
        displacement,
      }

      this.impactDatas[i] = impactData
    }
  }
}
