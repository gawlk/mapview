// @ts-expect-error - TS Expects types
import TemplateZip from '/src/assets/templates/templates.zip'
import { Button, DialogDivider } from '/src/components'
import { env } from '/src/env'
import { useAppState } from '/src/index'
import { downloadFile, mvrzExporter, run } from '/src/scripts'
import { store } from '/src/store'

import { Template } from './components/template'

interface Props extends NavigatorComponentProps {
  setTemplate: (file: File) => void
}

export const MVRZ = (props: Props) => {
  const { t } = useAppState()

  return (
    <div class="space-y-2">
      <For each={new Array(3).fill(0)}>
        {(_, index) => <Template index={index()} {...props} />}
      </For>

      <Button
        component={'a'}
        // @ts-expect-error - Temporary
        href={TemplateZip}
        download={`${t('Templates')}.zip`}
        target="_blank"
        rel="noopener noreferrer"
        leftIcon={IconTablerFileZip}
        rightIcon={IconTablerDownload}
        full
      >
        <span class="flex-1 text-left">{t('Download default templates')}</span>
      </Button>

      <DialogDivider class="-mx-4" />

      <Show when={env.isDev || !env.isHTTPS}>
        <Button
          leftIcon={IconTablerFileZip}
          rightIcon={IconTablerDownload}
          onClick={() => {
            void run(async () => {
              const selectedProject = store.selectedProject()
              selectedProject &&
                downloadFile(await mvrzExporter.export(selectedProject))
            })
          }}
          full
        >
          <span class="flex-1 text-left">{t('Download MVRZ file')}</span>
        </Button>

        <DialogDivider class="-mx-4" />
      </Show>

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
