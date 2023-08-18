import { useI18n } from '@solid-primitives/i18n'

import { Button } from '/src/components'
import { colors } from '/src/scripts'
import { store } from '/src/store'

interface Props {
  zone: BaseZone
}

export const ZonePreTable = (props: Props) => {
  const [t] = useI18n()

  const dcar = createMemo(() => {
    const dCar = props.zone.data.find(
      (data) => data.label.name === 'Characteristic deflection',
    )

    return dCar ? `Dcar = ${dCar.value.displayedStringWithUnit}` : ''
  })

  return (
    <div class="flex items-center space-x-2 border-t-2 border-black/10 p-2">
      <span
        class="block h-6 w-6 flex-none rounded-full"
        style={{ 'background-color': colors[props.zone.settings.color] }}
      />
      <div class="ml-2 flex-none space-x-2 text-sm">
        <span class="font-medium text-gray-500">{`${t('Zone')}${t(':')}`}</span>
        <span class="font-semibold">{props.zone.name || t('None')}</span>
        <span>{dcar()}</span>
      </div>
      <div class="w-full" />
      <Button
        size="sm"
        icon={IconTablerZoomIn}
        onClick={() => store.map && props.zone.fitOnMap(store.map)}
      />
      <Button
        size="sm"
        icon={props.zone.settings.isVisible ? IconTablerEye : IconTablerEyeOff}
        onClick={() => {
          props.zone.settings.isVisible = !props.zone.settings.isVisible
        }}
      />
    </div>
  )
}
