import { useI18n } from '@solid-primitives/i18n'

import { DialogZoneSettings } from './components/dialogZoneSettings'
import { SelectColorization } from './components/selectColorization'
import { Thresholds } from './components/thresholds'

export const MenuColors = () => {
  const [t] = useI18n()

  return (
    <>
      <SelectColorization />
      <Thresholds />
      <DialogZoneSettings />
    </>
  )
}
