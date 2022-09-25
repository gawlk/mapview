import { ExtendedBinaryReader, ExtendedBinaryWriter } from "./ExtendedBinaryStream";
import ImpactSetData from "./ImpactSetData";
import fs, { WriteStream } from "fs"
import { ImpactData, IsaanSimpleFileType } from "./types";

class SimpleFileStreamable {
    protected maxSupportedVersion!: number;
    protected objectVersion!: number;

    public fromStream(br: ExtendedBinaryReader) {
        this.objectVersion = br.readInt32();
        if (this.objectVersion > this.MaxSupportedVersion) {
            throw ("Version not supported");
        }
    }

    public toStream(bw: ExtendedBinaryWriter, version?: number) {
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
    private fileType!: IsaanSimpleFileType;
    private fileVersion!: number;


    constructor() {
        super();
        this.maxSupportedVersion = 1;
        this.objectVersion = this.maxSupportedVersion;
    }

    public fromStream(br: ExtendedBinaryReader) {
        super.fromStream(br);
        const magic: string = br.readString();
        if (magic != this.FILE_MAGIC)
            throw ("Not a Isaan simple file");
        this.fileType = br.readInt32() as IsaanSimpleFileType;
        this.fileVersion = br.readInt32();
    }

    public toStream(bw: ExtendedBinaryWriter, version: number) {
        super.toStream(bw, version);
        bw.write(this.FILE_MAGIC);
        bw.write(this.fileType);
        bw.write(this.fileVersion);
    }

    set FileType(value: IsaanSimpleFileType) {
        this.fileType = value;
    }

    get FileType(): IsaanSimpleFileType {
        return this.fileType;
    }

    set FileVersion(value: number) {
        this.fileVersion = value;
    }

    get FileVersion(): number {
        return this.fileVersion;
    }

};

class ImpactDataHeader extends SimpleFileStreamable {

    public pointId!: number;
    public nbSamples!: number;
    public nbOfImpact!: number;
    public nbOfDisplacement!: number;

    constructor() {
        super();
        this.maxSupportedVersion = 1;
    }

    public toStream(bw: ExtendedBinaryWriter, version: number) {
        super.toStream(bw, version);
        bw.write(this.pointId);
        bw.write(this.nbSamples);
        bw.write(this.nbOfImpact);
        bw.write(this.nbOfDisplacement);
    }

    public fromStream(br: ExtendedBinaryReader) {
        super.fromStream(br);
        this.pointId = br.readInt64();
        this.nbSamples = br.readInt32();
        this.nbOfImpact = br.readInt32();
        this.nbOfDisplacement = br.readInt32();
    }

}

class IsaanSimpleFile {

    protected fileHeader: IsaanSimpleFileHeader;

    constructor(filename?: string) {
        this.fileHeader = new IsaanSimpleFileHeader();
        if (filename) {
            const br: ExtendedBinaryReader = new ExtendedBinaryReader(fs.createReadStream(filename));
            this.loadFromFile(br);
            br.close();
        }
    }

    public SaveToFileAndDispose(filename: string | WriteStream) {
        const stream: WriteStream = typeof filename === "string" ? fs.createWriteStream(filename) : filename;
        const ebw: ExtendedBinaryWriter = new ExtendedBinaryWriter(stream);

        this.saveToFile(ebw);
        ebw.destroy();
    }

    protected saveToFile(ebw: ExtendedBinaryWriter) {
        this.fileHeader.toStream(ebw, this.fileHeader.MaxSupportedVersion);
    }

    protected loadFromFile(br: ExtendedBinaryReader) {
        this.fileHeader.fromStream(br);
    }
};

export default class ImpactDataFile extends IsaanSimpleFile {

    private impactDataHeader: ImpactDataHeader;
    private impactDatas: ImpactData[];
    private maxSupportedVersion: number = 1;

    constructor(impactSetData: ImpactSetData) {
        super();
        this.fileHeader.FileType = IsaanSimpleFileType.ImpactDataFile;
        this.fileHeader.FileVersion = this.maxSupportedVersion;
        this.impactDataHeader = new ImpactDataHeader();
        this.impactDataHeader.pointId = impactSetData.ID;
        this.impactDataHeader.nbSamples = impactSetData.numberOfSamples;
        this.impactDataHeader.nbOfImpact = impactSetData.numberOfImpact;
        this.impactDataHeader.nbOfDisplacement = impactSetData.numberOfDisplacement;
        this.impactDatas = impactSetData.ImpactDatas;
    }

    protected loadFromFile(br: ExtendedBinaryReader): void {
        super.loadFromFile(br);
        if (this.fileHeader.FileType !== IsaanSimpleFileType.ImpactDataFile) {
            throw ("Not a ImpactDataFile");
        }
        if (this.fileHeader.FileVersion > this.maxSupportedVersion) {
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
        super.saveToFile(ebw);
        this.impactDataHeader.toStream(ebw, this.maxSupportedVersion);
        for (let i = 0; i < this.impactDataHeader.nbOfImpact; i++) {
            ebw.writeArray(this.impactDatas[i].load);
            ebw.writeAsSingle(this.impactDatas[i].displacement);
        }
    }

}