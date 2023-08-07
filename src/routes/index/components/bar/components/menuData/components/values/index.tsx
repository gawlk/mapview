import { useI18n } from '@solid-primitives/i18n'

import { SelectDataLabel } from './components/selectDataLabel'
import { SelectIndex } from './components/selectIndex'
import { SelectSource } from './components/selectSource'

export const Values = () => {
  const [t] = useI18n()

  return (
    <>
      <SelectSource />
      <SelectIndex />
      <SelectDataLabel />
    </>
  )
}
