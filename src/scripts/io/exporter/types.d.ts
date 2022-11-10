interface Exporter {
  name: string
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
