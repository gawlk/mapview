import { useI18n } from '@solid-primitives/i18n'

import { Button } from '/src/components'

import SelectColorization from './components/selectColorization'

export default (props: NavigatorComponentProps) => {
  const [t] = useI18n()

  return (
    <>
      <SelectColorization />
      <Button
        full
        leftIcon={IconTabler123}
        rightIcon={IconTablerArrowNarrowRight}
        onClick={() => props.next('/values')}
      >
        <span class="flex-1 text-left">{t('Value settings')}</span>
      </Button>
      <Button
        full
        leftIcon={IconTablerFold}
        rightIcon={IconTablerArrowNarrowRight}
        onClick={() => props.next('/thresholds')}
      >
        <span class="flex-1 text-left">{t('Thresholds settings')}</span>
      </Button>
    </>
  )
}
