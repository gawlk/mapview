import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { downloadFile, mrvzExporter as mvrzExporter } from '/src/scripts'

import { Button } from '/src/components'

import Template from './components/template'

interface Props extends NavigatorComponentProps {
  setTemplate: (file: File) => void
}

export default (props: Props) => {
  const [t] = useI18n()

  return (
    <div class="space-y-2">
      <For each={new Array(3).fill(0)}>
        {(_, index) => <Template index={index()} {...props} />}
      </For>
      <Button
        leftIcon={IconTablerFileZip}
        rightIcon={IconTablerDownload}
        onClick={() =>
          (async () =>
            store.projects.selected &&
            downloadFile(await mvrzExporter.export(store.projects.selected)))()
        }
        full
      >
        <span class="flex-1 text-left">{t('Download MVRZ file')}</span>
      </Button>
      <Show when={props.back}>
        <Button
          full
          leftIcon={IconTablerChevronLeft}
          onClick={() => props.back?.()}
        >
          {t('Back')}
        </Button>
      </Show>
    </div>
  )
}
