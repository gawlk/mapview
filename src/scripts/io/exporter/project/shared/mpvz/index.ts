import { createZipFromEntity } from '/src/scripts'

export const mpvzExporter: MachineExporter = {
  name: 'MPVZ',
  export: async (project: MachineProject) =>
    new File(
      [
        await createZipFromEntity(project, {
          overlays: true,
          rawData: true,
          screenshots: true,
        }),
      ],
      `${project.name.toString()}.mpvz`,
      { type: 'blob' },
    ),
}
