<script setup lang="ts">
  const { t } = useI18n()
</script>

<template>
  <div class="space-y-6 text-gray-400">
    <p class="flex justify-center space-x-6">
      <a
        href="mailto:incoming+isaan-mapview-dev-mapview2-23904966-issue-@incoming.gitlab.com"
        class="hover:text-gray-500"
      >
        <IconHeroiconsSolidExclamationCircle class="h-5 w-5" />
      </a>
      <a
        href="https://gitlab.com/isaan/mapview-dev/mapview2"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-gray-500"
      >
        <IconTablerBrandGitlab class="h-5 w-5" />
      </a>
    </p>
    <p class="text-center text-sm">
      &copy; {{ new Date().getFullYear() }}
      <span class="font-bold">Mapview</span>,
      {{ t('All rights reserved.') }}
    </p>
  </div>
</template>

<i18n lang="yaml">
en:
  'All rights reserved.': 'All rights reserved.'
fr:
  'All rights reserved.': 'Tout droits réservés.'
</i18n>
