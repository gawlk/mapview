<template>
  <div class="text-gray-400 space-y-4">
    <p class="flex justify-center space-x-6">
      <a
        href="mailto:incoming+isaan-mapview-dev-mapview-10920065-8fp86ulq3ggjy85yc6cw6exvt-issue@incoming.gitlab.com"
        class="hover:text-gray-500"
      >
        <ExclamationCircleIcon class="h-5 w-5" />
      </a>
      <a
        href="https://gitlab.com/isaan/mapview-dev/mapview"
        class="hover:text-gray-500"
      >
        <svg
          class="h-5 w-5"
          fill="currentColor"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          viewBox="0 0 24 24"
        >
          <path
            d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"
          ></path>
        </svg>
      </a>
    </p>
    <p class="text-center text-sm">
      &copy; {{ new Date().getFullYear() }}
      <span class="font-bold">Mapview</span>,
      {{ t('All rights reserved.') }}
    </p>
  </div>
</template>

<script setup>
  import { useI18n } from 'vue-i18n'
  import { ExclamationCircleIcon } from '@heroicons/vue/solid'

  const { t } = useI18n()
</script>

<i18n lang="yaml">
en:
  'All rights reserved.': 'All rights reserved.'
fr:
  'All rights reserved.': 'Tout droits réservés.'
</i18n>
