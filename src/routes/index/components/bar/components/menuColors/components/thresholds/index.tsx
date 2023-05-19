import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { Details, Input, InputRadioHorizontal } from '/src/components'

import DialogColorThreshold from './components/dialogColorThreshold'
import InputCustomThreshold from './components/inputCustomThreshold'
import SelectThreshold from './components/selectThreshold'

export default () => {
  const [t] = useI18n()

  const selectedDataLabel = createMemo(
    () => store.selectedReport?.dataLabels.groups.selected?.choices.selected
  )

  const selectedDataLabelName = createMemo(() =>
    selectedDataLabel()?.getDisplayedName()
  )

  const selectedMathUnit = createMemo(() => selectedDataLabel()?.unit)

  const selectedThresholdsGroupChoices = createMemo(() => {
    const selectedUnit = selectedDataLabel()?.unit

    const thresholdsGroups = Object.values(
      store.selectedReport?.thresholds.groups || {}
    ) as ThresholdsGroup<string>[]

    const thresholdGroup = thresholdsGroups.find(
      (group) => group.unit.name === selectedUnit?.name
    )

    return thresholdGroup?.choices
  })

  const selectedThreshold = createMemo(
    () => selectedThresholdsGroupChoices()?.selected
  )

  const isCustom = createMemo(() =>
    selectedThreshold()?.kind === 'custom'
      ? (selectedThreshold() as CustomThreshold)
      : undefined
  )

  return (
    <Details
      button={{ leftIcon: IconTablerAdjustments, text: t('Thresholds') }}
      defaultOpen={true}
    >
      <SelectThreshold thresholds={selectedThresholdsGroupChoices()} />

      <Show
        when={
          isCustom() || selectedMathUnit()?.min !== selectedThreshold()?.value
        }
      >
        <DialogColorThreshold
          level="low"
          name={selectedDataLabelName()}
          mathUnit={selectedMathUnit()}
          from={selectedMathUnit()?.min}
          to={selectedThreshold()?.value}
        />
      </Show>

      <Show
        when={isCustom()}
        fallback={
          <DialogColorThreshold
            level="high"
            name={selectedDataLabelName()}
            mathUnit={selectedMathUnit()}
            from={selectedThreshold()?.value}
            to={selectedMathUnit()?.max}
          />
        }
      >
        {(customThreshold) => (
          <>
            <InputCustomThreshold
              isRange={
                store.selectedReport?.thresholds.inputs.isRequiredARange ||
                false
              }
              setIsRange={(value) =>
                store.selectedReport &&
                (store.selectedReport.thresholds.inputs.isRequiredARange =
                  value)
              }
              value={selectedThreshold()?.value || 0}
              setValue={(value) => {
                const threshold = selectedThresholdsGroupChoices()
                  ?.selected as CustomThreshold

                const mathUnit = selectedMathUnit()

                if (threshold && mathUnit) {
                  const number = mathUnit.currentToBase(Number(value))

                  threshold.value = number

                  threshold.valueHigh = Math.max(threshold.valueHigh, number)
                }
              }}
            />
            <DialogColorThreshold
              level="middle"
              name={selectedDataLabelName()}
              mathUnit={selectedMathUnit()}
              from={customThreshold()?.value}
              to={customThreshold()?.valueHigh}
            />
            <InputCustomThreshold
              isRange={
                store.selectedReport?.thresholds.inputs.isOptionalARange ||
                false
              }
              setIsRange={(value) =>
                store.selectedReport &&
                (store.selectedReport.thresholds.inputs.isOptionalARange =
                  value)
              }
              value={
                (selectedThreshold() as CustomThreshold | undefined)
                  ?.valueHigh || 0
              }
              setValue={(value) => {
                const threshold = selectedThreshold() as CustomThreshold

                const mathUnit = selectedMathUnit()

                if (threshold && mathUnit) {
                  const number = mathUnit.currentToBase(Number(value))

                  threshold.valueHigh = number

                  threshold.value = Math.min(threshold.value, number)
                }
              }}
            />
            <DialogColorThreshold
              level="high"
              name={selectedDataLabelName()}
              mathUnit={selectedMathUnit()}
              from={customThreshold()?.valueHigh}
              to={selectedMathUnit()?.max}
            />
          </>
        )}
      </Show>
    </Details>
  )
}
