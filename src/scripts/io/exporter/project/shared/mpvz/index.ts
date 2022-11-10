import { createZipFromProject } from '/src/scripts'

export const mpvzExporter: MachineExporter = {
  name: 'MPVZ',
  export: async (project: MachineProject) =>
    new File(
      [
        await createZipFromProject(project, {
          project: true,
          overlays: true,
          rawData: true,
          screenshots: true,
        }),
      ],
      `${project.name.toString().replaceAll(' ', '_')}.mpvz`,
      { type: 'application/json' }
    ),
}
