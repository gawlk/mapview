import { useI18n } from '@solid-primitives/i18n'

import { getBrowserLocale } from '/src/locales'

import store from '/src/store'

import { downloadFile, mrvzExporter } from '/src/scripts'

import { Button, classPropToString } from '/src/components'

interface Props extends NavigatorComponentProps {
  template: File
}

export default (props: Props) => {
  const [t] = useI18n()

  const [state, setState] = createStore({
    progress: 0,
    state: 'loading' as 'loading' | 'error' | 'success',
    message: t('Loading'),
  })

  onMount(async () => {
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
        body: await mrvzExporter.export(store.selectedProject, props.template),
      }
    )

    setState('progress', 80)

    if (res.headers.get('content-type') === 'application/octet-stream') {
      const blob = await res.blob()

      setState('progress', 90)

      downloadFile(
        new File(
          [blob],
          `${store.selectedProject.name.toString()}_${store.selectedReport?.name.toString()}.xlsx`
        )
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
            state.state === 'loading'
              ? '[&::-moz-progress-bar]:bg-yellow-600'
              : state.state === 'error'
              ? '[&::-moz-progress-bar]:bg-red-600 [&::-webkit-progress-value]:bg-red-600'
              : '[&::-moz-progress-bar]:bg-green-600 [&::-webkit-progress-value]:bg-green-600',
            'bg-orange w-full rounded-full bg-gray-100 [&::-moz-progress-bar]:rounded-full [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-gray-100 [&::-webkit-progress-value]:rounded-full',
          ])}
          value={state.progress}
          max="100"
        />
        <p
          class={classPropToString([
            state.state === 'loading'
              ? 'text-yellow-900'
              : state.state === 'error'
              ? 'text-red-900'
              : 'text-green-900',
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
