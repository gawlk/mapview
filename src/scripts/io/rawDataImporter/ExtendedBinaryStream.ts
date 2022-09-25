import { ReadStream, WriteStream } from "fs";

export class ExtendedBinaryWriter {

    private stream: WriteStream;

    constructor(stream: WriteStream) {
        this.stream = stream;
    }

    public close() {
        this.stream.close();
    }
    
    public destroy() {
        this.stream.destroy();
    }

    public write(data: any) {
        this.stream.write(data);
    }

    public writeArrayWithLen(data: number[], length: number) {
        for (let i = 0; i < length; i++) {
            this.write(data[i]);
        }
    }

    public writeArray(data: number[]) {
        const length = data.length;
        this.write(length);
        this.writeArrayWithLen(data, length);
    }

    public writeAsSingle(data: number[][]) {
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

    private stream: ReadStream;

    constructor(stream: ReadStream) {
        this.stream = stream;
    }

    public close() {
        this.stream.close();
    }

    public destroy() {
        this.stream.destroy();
    }

    public readInt32() {
        return this.stream.read(4);
    }

    public readInt64() {
        return this.stream.read(8);
    }

    public readString() {
        const length = this.readInt32();

        return this.stream.read(length);
    }
    
    public readArrayDoubleWithLen(length: number) {
        const array = [];
    
        for (let i = 0; i < length; i++) {
            array.push(this.readInt32());
        }
    
        return array;    
    }

    public readArrayDouble() {
        const length = this.readInt32();
        return this.readArrayDoubleWithLen(length);
    }

    public readTwoDimentionArraySingleAsDouble() {
        const length = this.readInt32();
        const arrayLen = this.readInt32();
        const array = [];

        for (let i = 0; i < length; i++) {
            array.push(this.readArrayDoubleWithLen(arrayLen));
        }

        return array;
    }

}