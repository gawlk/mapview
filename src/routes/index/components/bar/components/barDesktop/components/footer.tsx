import { useI18n } from '@solid-primitives/i18n'

export const Footer = () => {
  const [t] = useI18n()

  return (
    <div class="space-y-6 text-gray-400">
      <p class="flex justify-center space-x-6">
        <a
          class="hover:text-gray-500"
          href="mailto:incoming+isaan-mapview-dev-mapview2-23904966-issue-@incoming.gitlab.com"
        >
          <IconTablerExclamationCircle class="h-5 w-5" />
        </a>
        <a
          class="hover:text-gray-500"
          href="https://gitlab.com/isaan/mapview-dev/mapview2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconTablerBrandGitlab class="h-5 w-5" />
        </a>
      </p>
      <p class="text-center text-sm">
        &copy; {new Date().getFullYear()} <span class="font-bold">Mapview</span>
        , {t('All rights reserved')}
      </p>
    </div>
  )
}
