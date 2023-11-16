import { heavydynReportExports } from './heavydyn'

export * from './custom'

export const getSimpleReportExports = (
  project: MachineProject,
): AnyExporter[] => [
  ...(project.machine === 'Heavydyn' ? heavydynReportExports : []),
]

export {
  heavydynDynatestExporter,
  heavydynF25Exporter,
  heavydynPDXExporter,
  heavydynSwecoExporter,
} from './heavydyn'
