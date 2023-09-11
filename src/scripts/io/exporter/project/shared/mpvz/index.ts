import { createZIPFromEntity } from '/src/scripts'

export const mpvzExporter: MachineExporter = {
  name: 'MPVZ',
  export: async (project: MachineProject) =>
    new File(
      [
        await createZIPFromEntity(project, {
          overlays: true,
          rawData: true,
          screenshots: true,
        }),
      ],
      `${project.name.toString()}.mpvz`,
      { type: 'blob' },
    ),
}
