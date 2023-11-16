import { Sticky } from '/src/components'
import { useAppState } from '/src/index'
import { store } from '/src/store'

export const Update = () => {
  const { t } = useAppState()

  return (
    <Sticky
      onClose={() => {
        store.updateAvailable.set(false)
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
