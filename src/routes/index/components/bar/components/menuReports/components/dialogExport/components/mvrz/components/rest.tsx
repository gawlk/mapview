import { useI18n } from '@solid-primitives/i18n'

import { Button, classPropToString } from '/src/components'
import { getBrowserLocale } from '/src/locales'
import { downloadFile, mvrzExporter, run } from '/src/scripts'
import { store } from '/src/store'

interface Props extends NavigatorComponentProps {
  template: File
}

export const REST = (props: Props) => {
  const [t] = useI18n()

  const [state, setState] = createStore({
    progress: 0,
    state: 'loading' as 'loading' | 'error' | 'success',
    message: t('Loading'),
  })

  createEffect(async () => {
    if (!store.selectedProject) {
      return
    }

    setState('progress', 10)

    const res = await fetch(
      `https://mvreport.azurewebsites.net/api/getreport?local=${getBrowserLocale()}`,
      {
        method: 'POST',
        headers: {
          'content-type': 'octet-stream',
          'x-functions-key':
            'v7IwtPEOA8etaIi-CnqPsWE749uRZRKL31iuTTi6n8tIAzFuE_220w==',
        },
        body: await mvrzExporter.export(store.selectedProject, props.template),
      },
    )

    setState('progress', 80)

    if (res.headers.get('content-type') === 'application/octet-stream') {
      const blob = await res.blob()

      setState('progress', 90)

      downloadFile(
        new File(
          [blob],
          `${store.selectedProject.name.toString()}_${store.selectedReport?.name.toString()}.xlsx`,
        ),
      )

      setState({
        state: 'success',
        message: t('Success !'),
      })
    } else {
      const json = await res.json()

      setState({
        state: 'error',
        message: json.codestring,
      })
    }

    setState('progress', 100)
  })

  return (
    <div class="space-y-2">
      <div class="p-4">
        <progress
          class={classPropToString([
            run(() => {
              switch (state.state) {
                case 'loading':
                  return '[&::-moz-progress-bar]:bg-yellow-600'
                case 'error':
                  return '[&::-moz-progress-bar]:bg-red-600 [&::-webkit-progress-value]:bg-red-600'
                default:
                  return '[&::-moz-progress-bar]:bg-green-600 [&::-webkit-progress-value]:bg-green-600'
              }
            }),
            'bg-orange w-full rounded-full bg-gray-100 [&::-moz-progress-bar]:rounded-full [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-gray-100 [&::-webkit-progress-value]:rounded-full',
          ])}
          value={state.progress}
          max="100"
        />
        <p
          class={classPropToString([
            run(() => {
              switch (state.state) {
                case 'loading':
                  return 'text-yellow-900'
                case 'error':
                  return 'text-red-900'
                default:
                  return 'text-green-900'
              }
            }),
            'text-center text-sm font-medium',
          ])}
        >
          {state.message}
        </p>
      </div>
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
