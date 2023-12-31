import { createTimer } from '@solid-primitives/timer'
import localforage from 'localforage'

import { mpvzExporter, snapshotKey } from '/src/scripts'
import { store } from '/src/store'

export const createSnapshotInterval = () =>
  createTimer(snapshotMPVZ, 2000, setInterval)

const snapshotMPVZ = async () => {
  const project = store.selectedProject()

  if (!project || project.state() === 'Loading') return

  const snapshot = await mpvzExporter.export(project)

  void localforage.setItem(snapshotKey, snapshot)
}
