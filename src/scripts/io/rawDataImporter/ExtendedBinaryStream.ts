export class ExtendedBinaryWriter {

    private stream: WritableStream;

    constructor(stream: WritableStream) {
        this.stream = stream;
    }

    public async close(): Promise<void> {
        await this.stream.getWriter().close();
        return this.stream.close();
    }
    
    public destroy(): void {
        this.close();
    }

    public write(data: any): void {
        this.stream.getWriter().write(data);
    }

    public writeArrayWithLen(data: number[], length: number): void {
        for (let i = 0; i < length; i++) {
            this.write(data[i]);
        }
    }

    public writeArray(data: number[]): void {
        const length = data.length;

        this.write(length);
        this.writeArrayWithLen(data, length);
    }

    public writeAsSingle(data: number[][]): void {
        const length = data.length;
        const lengthArray = data[0].length;

        this.write(length);
        this.write(lengthArray);
        for (let i = 0; i < length; i++) {
            this.writeArrayWithLen(data[i], lengthArray);
        }
    }

}

export class ExtendedBinaryReader {

    private buffer: ArrayBuffer;
    private cursor: number;

    constructor(buffer: ArrayBuffer) {
        this.buffer = buffer
        this.cursor = 0;
    }

    private read(length: number): DataView {
        const buffer = this.buffer.slice(this.cursor, this.cursor += length);

        return new DataView(buffer, 0, length);
    }

    public readInt8(): number {
        return this.read(1).getInt8(0);
    }

    public readInt32(): number {
        return this.read(4).getInt32(0, true);
    }

    public readFloat32(): number {
        return this.read(4).getFloat32(0, true);
    }

    public readUInt32(): number {
        return this.read(4).getUint32(0, true);
    }

    public readInt64(): bigint {
        return this.read(8).getBigInt64(0, true);
    }

    public readString(): string {
        const length = this.readInt8();
        const textDecoder = new TextDecoder("utf-8");

        return textDecoder.decode(this.read(length));
    }
    
    public readArrayDoubleWithLen(length: number): number[] {
        const array: number[] = [];
    
        for (let i = 0; i < length; i++) {
            array.push(this.readFloat32());
        }
    
        return array;    
    }

    public readArrayDouble(): number[] {
        const length = this.readInt32();

        return this.readArrayDoubleWithLen(length);
    }

    public readTwoDimentionArraySingleAsDouble(): number[][] {
        const length = this.readInt32();
        const arrayLen = this.readInt32();
        const array = [];

        for (let i = 0; i < length; i++) {
            array.push(this.readArrayDoubleWithLen(arrayLen));
        }

        return array;
    }

}