interface Exporter {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export: (...args: any[]) => Promise<File>
}

type AnyExporter =
  | MachineExporter
  | HeavydynExporter
  | MaxidynExporter
  | MinidynExporter

interface MachineExporter extends Exporter {
  readonly export: (project: MachineProject) => Promise<File>
}

interface HeavydynExporter extends Exporter {
  readonly export: (project: HeavydynProject) => File
}

interface MaxidynExporter extends Exporter {
  readonly export: (project: MaxidynProject) => Promise<File>
}

interface MinidynExporter extends Exporter {
  readonly export: (project: MinidynProject) => Promise<File>
}
