import { heavydynReportExports } from './heavydyn'

export {
  heavydynDynatestExporter,
  heavydynF25Exporter,
  heavydynPDXExporter,
  heavydynSwecoExporter,
} from './heavydyn'

export * from './custom'

// TODO: Fix return type
export const getSimpleReportExports = (
  project: MachineProject
): AnyExporter[] => {
  return [...(project.machine === 'Heavydyn' ? heavydynReportExports : [])]
}
