import { createTimer } from '@solid-primitives/timer'
import { Meta, Title } from '@solidjs/meta'

import { store } from '/src/store'

import { checkUpdate, snapshotMPVZ } from './scripts'

import { Bar } from './components/bar'
import { Loading } from './components/loading'
import { Map } from './components/map'
import { Update } from './components/update'
import { Version } from './components/version'

import packageJSONRaw from '/src/../package.json?raw'
import { env } from '/src/env'

const packageJSON = JSON.parse(packageJSONRaw)

export const Index = () => {
  onMount(async () => {
    checkUpdate()

    createTimer(snapshotMPVZ, 2000, setInterval)

    if (env.isHTTPS) {
      // Block browser reload
      window.onbeforeunload = () => ''
    }
  })

  onCleanup(() => {
    store.projects.list.forEach((project) => project.remove())

    store.map?.stop()
  })

  const title = createMemo(() => {
    const currentProjectName = store.projects.selected?.name.toString()

    return currentProjectName ? `${currentProjectName} - ` : ''
  })

  return (
    <div class="relative h-full">
      <Title>{title()}Mapview</Title>
      <Meta name="description" content={packageJSON.description} />

      <Show when={store.importingFile}>
        <Loading />
      </Show>

      <Show when={store.updateAvailable}>
        <Update />
      </Show>

      <div class="flex h-full flex-col text-gray-900 lg:flex-row">
        <Map />
        <Bar />
      </div>

      <Version />
    </div>
  )
}

export default Index
