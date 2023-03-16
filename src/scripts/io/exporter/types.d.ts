interface Exporter {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export: (...args: any[]) => Promise<File> // TODO: Change any
}

type AnyExporter =
  | MachineExporter
  | HeavydynExporter
  | MaxidynExporter
  | MinidynExporter

interface MachineExporter extends Exporter {
  export: (project: MachineProject) => Promise<File>
}

interface HeavydynExporter extends Exporter {
  export: (project: HeavydynProject) => Promise<File>
}

interface MaxidynExporter extends Exporter {
  export: (project: MaxidynProject) => Promise<File>
}

interface MinidynExporter extends Exporter {
  export: (project: MinidynProject) => Promise<File>
}
