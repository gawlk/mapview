import { useI18n } from '@solid-primitives/i18n'
import { createTimer } from '@solid-primitives/timer'
import { Meta, Title } from '@solidjs/meta'

import store from '/src/store'

import { checkUpdate, snapshotMPVZ } from './scripts'

import { Button, SortableList, Sticky } from '/src/components'

import Bar from './components/bar'
import Loading from './components/loading'
import Map from './components/map'
import Version from './components/version'

import packageJSONRaw from '/src/../package.json?raw'
import env from '/src/env'

const packageJSON = JSON.parse(packageJSONRaw)

export default () => {
  const [t] = useI18n()

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
        <Sticky onClose={() => (store.updateAvailable = false)}>
          <span> {t('A new version is available')}. </span>{' '}
          <span class="inline-block">
            <a class="font-bold text-white underline" href="/">
              {t('Update')} <span aria-hidden="true">&rarr;</span>
            </a>
          </span>
        </Sticky>
      </Show>

      <div class="flex h-full flex-col text-gray-900 lg:flex-row">
        <Map />
        <Bar />
      </div>

      {/* <SortableList
        orientation="vertical"
        list={[1, 2, 3]}
        itemToId={(item) => String(item)}
        component={(props: ButtonPropsWithHTMLAttributes) => (
          <Button leftIcon={IconTabler123} {...props}>
            Hey {props.children}
          </Button>
        )}
      /> */}

      <Version />
    </div>
  )
}
