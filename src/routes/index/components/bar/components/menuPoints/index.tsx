import { useI18n } from '@solid-primitives/i18n'

import SelectColorization from './components/selectColorization'
import Thresholds from './components/thresholds'
import Values from './components/values'

export default () => {
  const [t] = useI18n()

  return (
    <>
      <SelectColorization />
      <Values />
      <Thresholds />
    </>
  )
}
