import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { roundValue } from '/src/scripts'

import { Details, DialogSelect, Input, Label } from '/src/components'

export default () => {
  const [t] = useI18n()

  // TODO: Create title element instead of using labels

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
        each={
          Object.values(store.projects.selected?.units || {}).filter(
            (unit) => !unit.readOnly
          ) as MathUnit<string>[]
        }
      >
        {(mathUnit) => (
          <Details
            defaultOpen={true}
            button={{
              leftIcon: getMathUnitIcon(mathUnit),
              label: t('Unit'),
              text: t(mathUnit.name),
            }}
          >
            <div class="flex space-x-2">
              <DialogSelect
                position="relative"
                button={{
                  full: true,
                  label: t('Unit'),
                }}
                options={{
                  selected: mathUnit.currentUnit,
                  list: mathUnit.possibleSettings.map((setting) => setting[0]),
                }}
              />

              <DialogSelect
                position="relative"
                button={{
                  full: true,
                  leftIcon: IconTablerDecimal,
                  label: t('Precision'),
                }}
                options={{
                  selected: mathUnit.currentPrecision,
                  list: mathUnit.possibleSettings.map((setting) =>
                    String(setting[1])
                  ),
                }}
              />
            </div>
            <div class="flex space-x-2">
              <Input
                leftIcon={IconTablerArrowBarUp}
                label={t('Min')}
                full
                value={roundValue(mathUnit.baseToCurrent(mathUnit.min))}
                onInput={(value) =>
                  (mathUnit.min = mathUnit.currentToBase(Number(value || 0)))
                }
              />
              <Input
                leftIcon={IconTablerArrowBarToUp}
                label={t('Max')}
                full
                value={roundValue(mathUnit.baseToCurrent(mathUnit.max))}
                onInput={(value) =>
                  (mathUnit.max = mathUnit.currentToBase(Number(value || 0)))
                }
              />
            </div>
          </Details>
        )}
      </For>
    </Label>
  )
}
