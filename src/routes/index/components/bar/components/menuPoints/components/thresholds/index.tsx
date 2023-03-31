import { useI18n } from '@solid-primitives/i18n'

import { Button } from '/src/components'

export default (props: NavigatorComponentProps) => {
  const [t] = useI18n()

  return (
    <Button
      disabled={!props.back}
      full
      onClick={props.back}
      leftIcon={IconTablerArrowNarrowLeft}
    >
      <span class="flex-1 text-left">{t('Back')}</span>
    </Button>
  )
}
