import localforage from 'localforage'

import { store } from '/src/store'

import { mpvzExporter, snapshotKey } from '/src/scripts'

export const snapshotMPVZ = async () => {
  const project = store.selectedProject

  if (!project || project.state === 'Loading') return

  const snapshot = await mpvzExporter.export(project)

  localforage.setItem(snapshotKey, snapshot)
}
