import { useI18n } from '@solid-primitives/i18n'

import { Sticky } from '/src/components'
import { store } from '/src/store'

export const Update = () => {
  const [t] = useI18n()

  return (
    <Sticky
      onClose={() => {
        store.updateAvailable = false
      }}
    >
      <span> {t('A new version is available')}. </span>{' '}
      <span class="inline-block">
        <a class="font-bold text-white underline" href="/">
          {t('Update')} <span aria-hidden="true">&rarr;</span>
        </a>
      </span>
    </Sticky>
  )
}
