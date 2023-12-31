import { Details, DialogSelect, Input, Label } from '/src/components'
import { useAppState } from '/src/index'
import { roundValue } from '/src/scripts'
import { store } from '/src/store'

export const Units = () => {
  const { t } = useAppState()

  const getMathUnitIcon = (mathUnit: MathUnit<string>) => {
    switch (mathUnit.name) {
      case 'CumSum':
        return IconTablerSum
      case 'Deflection':
        return IconTablerArrowBarToDown
      case 'Distance':
        return IconTablerRuler2
      case 'Force':
        return IconTablerWeight
      case 'Modulus':
        return IconTablerEaseOut
      case 'Percentage':
        return IconTablerPercentage
      case 'Stiffness':
        return IconTablerCurlyLoop
      case 'Temperature':
        return IconTablerTemperature
      case 'Time':
        return IconTablerClock
    }
  }

  return (
    <Label size="lg" label={t('Units')} class="space-y-4">
      <For
        each={store
          .selectedProject()
          ?.units.list.filter((unit) => !unit.readOnly)}
      >
        {(mathUnit) => (
          <Details
            defaultOpen
            locked
            button={{
              leftIcon: getMathUnitIcon(mathUnit),
              label: t('Unit'),
              text: t(mathUnit.name),
            }}
          >
            <div class="flex space-x-2">
              <DialogSelect
                attached
                button={{
                  full: true,
                  label: t('Unit'),
                }}
                values={{
                  selected: mathUnit.currentUnit(),
                  list: mathUnit.possibleSettings.map((setting) => setting[0]),
                }}
                onClose={(value) => {
                  value && mathUnit.currentUnit.set(value)
                }}
              />
              <DialogSelect
                attached
                button={{
                  full: true,
                  leftIcon: IconTablerDecimal,
                  label: t('Precision'),
                }}
                values={{
                  selected: String(mathUnit.currentPrecision()),
                  list: mathUnit.possiblePrecisions.map((precision) =>
                    String(precision),
                  ),
                }}
                onClose={(value) => {
                  value && mathUnit.currentPrecision.set(Number(value))
                }}
              />
            </div>
            <div class="flex space-x-2">
              <Input
                leftIcon={IconTablerArrowBarUp}
                label={t('Min')}
                full
                value={roundValue(mathUnit.baseToCurrent(mathUnit.min()))}
                bind
                onInput={(value) => {
                  mathUnit.min.set(mathUnit.currentToBase(Number(value || 0)))
                }}
              />
              <Input
                leftIcon={IconTablerArrowBarToUp}
                label={t('Max')}
                full
                bind
                value={roundValue(mathUnit.baseToCurrent(mathUnit.max()))}
                onInput={(value) => {
                  mathUnit.max.set(mathUnit.currentToBase(Number(value || 0)))
                }}
              />
            </div>
          </Details>
        )}
      </For>
    </Label>
  )
}
