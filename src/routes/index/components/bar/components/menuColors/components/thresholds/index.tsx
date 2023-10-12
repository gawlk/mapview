import { Details, InputRadioHorizontal, Interactive } from '/src/components'
import { useAppState } from '/src/index'
import { blend, colors, roundValue, run } from '/src/scripts'
import { store } from '/src/store'

import { DialogColorThreshold } from './components/dialogColorThreshold'
import { InputCustomThreshold } from './components/inputCustomThreshold'
import { SelectThreshold } from './components/selectThreshold'
import { SpanCustomThresholdRange } from './components/spanCustomThresholdRange'

export const Thresholds = () => {
  const { t } = useAppState()

  const selectedDataLabel = createMemo(
    () => store.selectedReport?.dataLabels.groups.selected?.choices.selected,
  )

  const selectedDataLabelName = createMemo(
    () => selectedDataLabel()?.getDisplayedName(),
  )

  const selectedMathUnit = createMemo(() => selectedDataLabel()?.unit)

  const selectedThresholdsGroupChoices = createMemo(() => {
    const selectedUnit = selectedDataLabel()?.unit

    const thresholdsGroups = Object.values(
      store.selectedReport?.thresholds.groups || {},
    ) as ThresholdsGroup<string>[]

    const thresholdGroup = thresholdsGroups.find(
      (group) => group.unit.name === selectedUnit?.name,
    )

    return thresholdGroup?.choices
  })

  const selectedThreshold = createMemo(
    () => selectedThresholdsGroupChoices()?.selected,
  )

  const isCustom = createMemo(() =>
    selectedThreshold()?.kind === 'custom'
      ? (selectedThreshold() as CustomThreshold)
      : undefined,
  )

  const baseToCurrent = (value = 0) =>
    roundValue(selectedMathUnit()?.baseToCurrent(value) || 0)

  const isBicolor = createMemo(() => isCustom()?.type === 'Bicolor')
  const isGradient = createMemo(() => isCustom()?.type === 'Gradient')

  const min = createMemo(() => baseToCurrent(selectedMathUnit()?.min))

  const max = createMemo(() => baseToCurrent(selectedMathUnit()?.max))

  return (
    <Details
      button={{ leftIcon: IconTablerAdjustments, text: t('Thresholds') }}
      defaultOpen
      locked
    >
      <SelectThreshold
        thresholds={selectedThresholdsGroupChoices()}
        mathUnit={selectedMathUnit()}
      />

      <Show when={isCustom()}>
        {(customThreshold) => (
          <InputRadioHorizontal
            full
            values={{
              selected: customThreshold().type,
              list: [
                {
                  value: 'Bicolor',
                  text: t('Bicolor'),
                },
                {
                  value: 'Gradient',
                  text: t('Gradient'),
                },
                {
                  value: 'Tricolor',
                  text: t('Tricolor'),
                },
              ],
            }}
            onChange={(value) => {
              customThreshold().type = value as CustomThresholdType
            }}
          />
        )}
      </Show>

      <Show
        when={
          // Hide for N.S. threshold
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
            from={selectedThreshold()?.value ?? 0}
            to={selectedMathUnit()?.max ?? 0}
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
              setIsRange={(value) => {
                store.selectedReport &&
                  (store.selectedReport.thresholds.inputs.isRequiredARange =
                    value)
              }}
              value={baseToCurrent(customThreshold().value)}
              setValue={(value) => {
                const mathUnit = selectedMathUnit()

                if (mathUnit) {
                  const number = mathUnit.currentToBase(Number(value))

                  customThreshold().value = number

                  customThreshold().valueHigh = Math.max(
                    customThreshold().valueHigh,
                    number,
                  )
                }
              }}
              min={baseToCurrent(selectedMathUnit()?.min)}
              max={baseToCurrent(selectedMathUnit()?.max)}
            />

            <Show when={!isBicolor()}>
              <Show
                when={isGradient()}
                fallback={
                  <DialogColorThreshold
                    level="middle"
                    name={selectedDataLabelName()}
                    mathUnit={selectedMathUnit()}
                    from={customThreshold()?.value}
                    to={customThreshold()?.valueHigh}
                  />
                }
              >
                {run(() => {
                  const thresoldColors = createMemo(
                    () => store.selectedReport?.thresholds.colors,
                  )

                  const colorLow = createMemo(
                    () => colors[thresoldColors()?.low || 'orange'],
                  )

                  const colorHigh = createMemo(
                    () => colors[thresoldColors()?.high || 'orange'],
                  )

                  const { value, valueHigh } = customThreshold()

                  const disabled = createMemo(() => value === valueHigh)

                  return (
                    <Interactive
                      leftIcon={IconTablerColorSwatch}
                      full
                      kind="static"
                      bgColor="base"
                      borderColor="transparent"
                      disabled={disabled()}
                      style={
                        !disabled()
                          ? {
                              color: blend(
                                blend(colorLow(), colorHigh()),
                                '#000000',
                                0.75,
                              ),
                              background: `linear-gradient(180deg,${colorLow()},${colorHigh()})`,
                              'border-top-color': colorLow(),
                              'border-bottom-color': colorHigh(),
                            }
                          : {}
                      }
                    >
                      <SpanCustomThresholdRange
                        name={selectedDataLabelName() || ''}
                        mathUnit={selectedMathUnit()}
                        from={value}
                        to={valueHigh}
                        last={false}
                      />
                    </Interactive>
                  )
                })}
              </Show>

              <InputCustomThreshold
                isRange={
                  store.selectedReport?.thresholds.inputs.isOptionalARange ||
                  false
                }
                setIsRange={(value) => {
                  store.selectedReport &&
                    (store.selectedReport.thresholds.inputs.isOptionalARange =
                      value)
                }}
                value={baseToCurrent(customThreshold().valueHigh)}
                setValue={(value) => {
                  const mathUnit = selectedMathUnit()

                  if (mathUnit) {
                    const number = mathUnit.currentToBase(Number(value))

                    customThreshold().valueHigh = number

                    customThreshold().value = Math.min(
                      customThreshold().value,
                      number,
                    )
                  }
                }}
                min={min()}
                max={max()}
              />
            </Show>

            <DialogColorThreshold
              level="high"
              name={selectedDataLabelName()}
              mathUnit={selectedMathUnit()}
              from={
                isBicolor()
                  ? customThreshold()?.value
                  : customThreshold()?.valueHigh
              }
              to={selectedMathUnit()?.max}
            />
          </>
        )}
      </Show>
    </Details>
  )
}
