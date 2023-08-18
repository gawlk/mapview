import { DialogZoneSettings } from './components/dialogZoneSettings'
import { SelectColorization } from './components/selectColorization'
import { Thresholds } from './components/thresholds'

export const MenuColors = () => {
  return (
    <>
      <SelectColorization />
      <Thresholds />
      <DialogZoneSettings />
    </>
  )
}
