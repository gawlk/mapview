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
      `${project.name.toString().replaceAll(' ', '_')}.mpvz`,
      { type: 'blob' }
    ),
}
