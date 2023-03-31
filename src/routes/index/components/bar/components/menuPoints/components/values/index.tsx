import { useI18n } from '@solid-primitives/i18n'

import { Button } from '/src/components'

import SelectDataLabel from './components/selectDataLabel'
import SelectIndex from './components/selectIndex'
import SelectSource from './components/selectSource'

export default (props: NavigatorComponentProps) => {
  const [t] = useI18n()

  return (
    <>
      <SelectSource />
      <SelectIndex />
      <SelectDataLabel />
      <Button
        disabled={!props.back}
        full
        onClick={props.back}
        leftIcon={IconTablerArrowNarrowLeft}
      >
        <span class="flex-1 text-left">{t('Back')}</span>
      </Button>
    </>
  )
}
