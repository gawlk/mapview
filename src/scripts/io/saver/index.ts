import { zipSync } from 'fflate'

export const save = async (project: MachineProject) => {
  console.log(project.information[0].value)

  const zipped = zipSync({
    'database.json': new Uint8Array(
      await new Blob([JSON.stringify(project.toJSON(), null, 2)], {
        type: 'json',
      }).arrayBuffer()
    ),
  })

  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([zipped]))
  a.download = `${String(project.name.value).replaceAll(' ', '_')}.mpvz`
  a.click()
}
