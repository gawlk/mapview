<script setup lang="ts">
  import { getBrowserLocale } from '/src/locales'

  import { mrvzExporter } from '/src/scripts'
  import { downloadFile } from '/src/scripts'

  const { t } = useI18n()

  const props = defineProps<{
    project: MachineProject
    template: File
  }>()

  const state = reactive({
    progress: 0,
    state: 'loading' as 'loading' | 'error' | 'success',
    message: t('Loading...'),
  })

  onMounted(async () => {
    state.progress = 10

    const res = await fetch(
      `https://mvreport.azurewebsites.net/api/getreport?local=${getBrowserLocale()}`,
      {
        method: 'POST',
        headers: {
          'content-type': 'octet-stream',
          'x-functions-key':
            'v7IwtPEOA8etaIi-CnqPsWE749uRZRKL31iuTTi6n8tIAzFuE_220w==',
        },
        body: await mrvzExporter.export(props.project, props.template),
      }
    )

    state.progress = 80

    if (res.headers.get('content-type') === 'application/octet-stream') {
      const blob = await res.blob()

      state.progress = 90

      downloadFile(
        new File(
          [blob],
          `${props.project.name.toString()}_${props.project.reports.selected?.name.toString()}.xlsx`
        )
      )

      state.state = 'success'
      state.message = t('Success !')
    } else {
      const json = await res.json()

      state.progress = 90

      state.message = json.codestring
      state.state = 'error'
    }

    state.progress = 100
  })
</script>

<template>
  <div>
    <progress
      class="bg-orange w-full rounded-full bg-gray-100 [&::-moz-progress-bar]:rounded-full [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-gray-100 [&::-webkit-progress-value]:rounded-full"
      :class="[
        state.state === 'loading'
          ? '[&::-moz-progress-bar]:bg-yellow-600'
          : state.state === 'error'
          ? '[&::-moz-progress-bar]:bg-red-600 [&::-webkit-progress-value]:bg-red-600'
          : '[&::-moz-progress-bar]:bg-green-600 [&::-webkit-progress-value]:bg-green-600',
      ]"
      :value="state.progress"
      max="100"
    />
    <p
      class="text-center text-sm font-medium"
      :class="[
        state.state === 'loading'
          ? 'text-yellow-900'
          : state.state === 'error'
          ? 'text-red-900'
          : 'text-green-900',
      ]"
    >
      {{ state.message }}
    </p>
  </div>
</template>

<i18n lang="yaml">
fr:
  'Loading...': 'Chargement...'
  'Success !': 'Succès !'
</i18n>
