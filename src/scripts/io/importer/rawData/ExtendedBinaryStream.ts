export class ExtendedBinaryReader {
  private buffer: ArrayBuffer
  private cursor: number

  constructor(buffer: ArrayBuffer) {
    this.buffer = buffer
    this.cursor = 0
  }

  private read(length: number): DataView {
    const buffer = this.buffer.slice(this.cursor, (this.cursor += length))

    const dataView = new DataView(buffer, 0, length)

    return dataView
  }

  public readInt8(): number {
    return this.read(1).getInt8(0)
  }

  public readInt32(): number {
    return this.read(4).getInt32(0, true)
  }

  public readFloat32(): number {
    return this.read(4).getFloat32(0, true)
  }

  public readUInt32(): number {
    return this.read(4).getUint32(0, true)
  }

  public readInt64(): bigint {
    return this.read(8).getBigInt64(0, true)
  }

  public readString(): string {
    const length = this.readInt8()
    const textDecoder = new TextDecoder('utf-8')

    return textDecoder.decode(this.read(length))
  }

  public readArrayDoubleWithLen(length: number): number[] {
    const array: number[] = []

    for (let i = 0; i < length; i++) {
      array.push(this.readFloat32())
    }

    return array
  }

  public readArrayDouble(): number[] {
    const length = this.readInt32()

    return this.readArrayDoubleWithLen(length)
  }

  public readTwoDimentionArraySingleAsDouble(): number[][] {
    const length = this.readInt32()
    const arrayLen = this.readInt32()
    const array = []

    for (let i = 0; i < length; i++) {
      array.push(this.readArrayDoubleWithLen(arrayLen))
    }

    return array
  }
}
