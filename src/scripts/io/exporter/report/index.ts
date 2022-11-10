export * from './custom'
import { heavydynReportExports } from './heavydyn'

// TODO: Fix return type
export const getSimpleReportExports = (
  project: MachineProject
): AnyExporter[] => {
  return [...(project.machine === 'Heavydyn' ? heavydynReportExports : [])]
}
