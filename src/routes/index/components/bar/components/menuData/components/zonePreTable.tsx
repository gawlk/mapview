import { Button } from '/src/components'
import { useAppState } from '/src/index'
import { CHARACTERISTIC_DEFLECTION_NAME, colors } from '/src/scripts'
import { store } from '/src/store'

interface Props {
  readonly zone: BaseZone
}

export const ZonePreTable = (props: Props) => {
  const { t } = useAppState()

  const dcar = createMemo(() => {
    const dCar = Array.from(props.zone.dataset.values()).find(
      (data) => data.label.name === CHARACTERISTIC_DEFLECTION_NAME,
    )

    return dCar ? `Dcar = ${dCar.value.displayedStringWithUnit()}` : ''
  })

  return (
    <div class="flex items-center space-x-2 border-t-2 border-black/10 p-2">
      <span
        class="block h-6 w-6 flex-none rounded-full"
        style={{ 'background-color': colors[props.zone.settings.color()] }}
      />
      <div class="ml-2 flex-none space-x-2 text-sm">
        <span class="font-medium text-gray-500">{`${t('Zone')}${t(':')}`}</span>
        <span class="font-semibold">{props.zone.name() || t('None')}</span>
        <span>{dcar()}</span>
      </div>
      <div class="w-full" />
      <Button
        size="sm"
        icon={IconTablerZoomIn}
        onClick={() => {
          const map = store.map()
          map && props.zone.fitOnMap(map)
        }}
      />
      <Button
        size="sm"
        icon={
          props.zone.settings.isVisible() ? IconTablerEye : IconTablerEyeOff
        }
        onClick={() => {
          props.zone.settings.isVisible.set((b) => !b)
        }}
      />
    </div>
  )
}
