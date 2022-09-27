import { ExtendedBinaryReader, ExtendedBinaryWriter } from "./ExtendedBinaryStream";
import ImpactSetData from "./ImpactSetData";
import fs, { WriteStream } from "fs"

enum IsaanSimpleFileType {
    ImpactDataFile = 0x8D937355
}

class SimpleFileStreamable {

    protected maxSupportedVersion!: number;
    protected objectVersion!: number;

    public fromStream(br: ExtendedBinaryReader): void {
        this.objectVersion = br.readInt32();
        if (this.objectVersion > this.MaxSupportedVersion) {
            throw ("Version not supported");
        }
    }

    public toStream(bw: ExtendedBinaryWriter, version?: number): void {
        bw.write(this.objectVersion);
        if (version && version > this.MaxSupportedVersion) {
            throw ("Version not supported");
        }
    }

    get MaxSupportedVersion(): number {
        return this.maxSupportedVersion;
    }

    get ObjectVersion(): number {
        return this.objectVersion;
    }
}

class IsaanSimpleFileHeader extends SimpleFileStreamable {

    private FILE_MAGIC: string = "ISAANSIMPLEFILE";
    public fileType!: IsaanSimpleFileType;
    public fileVersion!: number;


    constructor() {
        super();
        this.maxSupportedVersion = 1;
        this.objectVersion = this.maxSupportedVersion;
    }

    public fromStream(br: ExtendedBinaryReader): void {
        super.fromStream(br);
        const magic: string = br.readString();
        if (magic != this.FILE_MAGIC)
            throw ("Not a Isaan simple file");
        this.fileType = br.readUInt32() as IsaanSimpleFileType;
        this.fileVersion = br.readInt32();
    }

    public toStream(bw: ExtendedBinaryWriter, version: number): void {
        super.toStream(bw, version);
        bw.write(this.FILE_MAGIC);
        bw.write(this.fileType);
        bw.write(this.fileVersion);
    }

};

class ImpactDataHeader extends SimpleFileStreamable {

    public pointId!: bigint;
    public nbSamples!: number;
    public nbOfImpact!: number;
    public nbOfDisplacement!: number;

    constructor() {
        super();
        this.maxSupportedVersion = 1;
    }

    public toStream(bw: ExtendedBinaryWriter, version: number): void {
        super.toStream(bw, version);
        bw.write(this.pointId);
        bw.write(this.nbSamples);
        bw.write(this.nbOfImpact);
        bw.write(this.nbOfDisplacement);
    }

    public fromStream(br: ExtendedBinaryReader): void {
        super.fromStream(br);
        this.pointId = br.readInt64();
        this.nbSamples = br.readInt32();
        this.nbOfImpact = br.readInt32();
        this.nbOfDisplacement = br.readInt32();
    }

}

export default class ImpactDataFile {

    private fileHeader: IsaanSimpleFileHeader;
    private impactDataHeader: ImpactDataHeader;
    private impactDatas: ImpactData[];
    private maxSupportedVersion: number = 1;

    constructor(impactSetData?: ImpactSetData) {
        this.fileHeader = new IsaanSimpleFileHeader();
        this.fileHeader.fileType = IsaanSimpleFileType.ImpactDataFile;
        this.fileHeader.fileVersion = this.maxSupportedVersion;
        this.impactDataHeader = new ImpactDataHeader();
        this.impactDatas = new Array<ImpactData>();
        if (impactSetData) {
            this.impactDataHeader.pointId = impactSetData.ID;
            this.impactDataHeader.nbSamples = impactSetData.numberOfSamples;
            this.impactDataHeader.nbOfImpact = impactSetData.numberOfImpact;
            this.impactDataHeader.nbOfDisplacement = impactSetData.numberOfDisplacement;
            this.impactDatas = impactSetData.ImpactDatas;
        }
    }

    public SaveToFileAndDispose(filename: string | WriteStream): void {
        const stream: WriteStream = typeof filename === "string" ? fs.createWriteStream(filename) : filename;
        const ebw: ExtendedBinaryWriter = new ExtendedBinaryWriter(stream);

        this.saveToFile(ebw);
        ebw.destroy();
    }

    public loadFromFile(br: ExtendedBinaryReader): void {
        this.fileHeader.fromStream(br);
        if (this.fileHeader.fileType !== IsaanSimpleFileType.ImpactDataFile) {
            throw ("Not a ImpactDataFile");
        }
        if (this.fileHeader.fileVersion > this.maxSupportedVersion) {
            throw ("Version not supported");
        }
        this.impactDataHeader = new ImpactDataHeader();
        this.impactDataHeader.fromStream(br);
        this.impactDatas = new Array(this.impactDataHeader.nbOfImpact);
        for (let i = 0; i < this.impactDataHeader.nbOfImpact; i++) {
            this.impactDatas[i] = {
                load: br.readArrayDouble(),
                displacement: br.readTwoDimentionArraySingleAsDouble()
            };
        }
    }

    protected saveToFile(ebw: ExtendedBinaryWriter): void {
        this.fileHeader.toStream(ebw, this.fileHeader.MaxSupportedVersion);
        this.impactDataHeader.toStream(ebw, this.maxSupportedVersion);
        for (let i = 0; i < this.impactDataHeader.nbOfImpact; i++) {
            ebw.writeArray(this.impactDatas[i].load);
            ebw.writeAsSingle(this.impactDatas[i].displacement);
        }
    }

    get ImpactDatas(): ImpactData[] {
        return this.impactDatas;
    }

    get ImpactDataHeader(): ImpactDataHeader {
        return this.impactDataHeader;
    }

}