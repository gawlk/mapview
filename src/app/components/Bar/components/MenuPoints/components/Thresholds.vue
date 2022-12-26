<script setup lang="ts">
  import store from '/src/store'

  import {
    blend,
    colorsClasses,
    convertValueFromUnitAToUnitB,
  } from '/src/scripts'

  import IconColorSwatch from '~icons/heroicons-solid/color-swatch'
  import IconViewList from '~icons/heroicons-solid/view-list'
  import IconFold from '~icons/octicon/fold-16'

  import Button from '/src/components/Button.vue'
  import Divider from '/src/components/Divider.vue'
  import InputNumberSwitchable from '/src/components/InputNumberSwitchable.vue'
  import Listbox from '/src/components/Listbox.vue'
  import ListboxColors from '/src/components/ListboxColors.vue'

  const { t } = useI18n()

  const selectedReport = computed(
    () => store.projects.selected?.reports.selected
  )

  const selectedDataLabel = computed(
    () => selectedReport.value?.dataLabels.groups.selected?.choices.selected
  )

  const selectedUnit = computed(
    () => selectedDataLabel.value?.unit as MathUnit<string> | undefined
  )

  const currentThresholdsGroup = computed(
    () =>
      selectedReport.value &&
      (Object.values(selectedReport.value.thresholds.groups).find(
        (group: ThresholdsGroup<string>) =>
          group.unit === selectedDataLabel.value?.unit
      ) as ThresholdsGroup<string>)
  )

  const formattedTresholdValue = computed(
    () =>
      `${
        currentThresholdsGroup.value?.choices.selected && selectedUnit.value
          ? convertValueFromUnitAToUnitB(
              currentThresholdsGroup.value.choices.selected.value,
              selectedUnit.value.baseUnit,
              selectedUnit.value.currentUnit
            ).toLocaleString()
          : '?'
      } ${selectedUnit.value?.currentUnit}`
  )

  const formattedTresholdValueHigh = computed(
    () =>
      `${
        currentThresholdsGroup.value?.choices.selected && selectedUnit.value
          ? convertValueFromUnitAToUnitB(
              currentThresholdsGroup.value.choices.selected.kind === 'custom'
                ? currentThresholdsGroup.value.choices.selected.valueHigh
                : currentThresholdsGroup.value.choices.selected.value,
              selectedUnit.value.baseUnit,
              selectedUnit.value.currentUnit
            )?.toLocaleString()
          : '?'
      } ${selectedUnit.value?.currentUnit}`
  )
</script>

<template>
  <div
    class="space-y-2"
    v-if="selectedReport && typeof selectedUnit === 'object'"
    :icon="IconFold"
  >
    <Listbox
      :icon="IconViewList"
      :values="
        currentThresholdsGroup?.choices.list.map((threshold) =>
          t(threshold.name)
        )
      "
      @selectIndex="
        (index) =>
          currentThresholdsGroup &&
          (currentThresholdsGroup.choices.selected =
            currentThresholdsGroup.choices.list[index])
      "
      :preSelected="`${t('Selected')}${t(':')}`"
      :selected="t(currentThresholdsGroup?.choices.selected?.name || '')"
      full
    />
    <Divider
      v-if="currentThresholdsGroup?.choices.selected?.kind === 'custom'"
    />
    <Listbox
      v-if="currentThresholdsGroup?.choices.selected?.kind === 'custom'"
      :icon="IconColorSwatch"
      :values="[t('Bicolor'), t('Gradient'), t('Tricolor')]"
      @selectIndex="
        (index) =>
          currentThresholdsGroup &&
          currentThresholdsGroup.choices.selected?.kind === 'custom' &&
          (currentThresholdsGroup.choices.selected.type =
            index === 0 ? 'Bicolor' : index === 1 ? 'Gradient' : 'Tricolor')
      "
      :preSelected="`${t('Type')}${t(':')}`"
      :selected="t(currentThresholdsGroup?.choices.selected.type)"
      full
    />
    <ListboxColors
      :icon="IconColorSwatch"
      :color="selectedReport.thresholds.colors.low"
      @selectColor="(color: ColorName) => {
          selectedReport && (selectedReport.thresholds.colors.low = color)
        }"
      :text="`${convertValueFromUnitAToUnitB(
        selectedUnit.min,
        selectedUnit.baseUnit,
        selectedUnit.currentUnit
      ).toLocaleString()} ${selectedUnit?.currentUnit} ≤ ${t(
        selectedDataLabel?.name || ''
      )} < ${formattedTresholdValue}`"
    />
    <InputNumberSwitchable
      v-if="currentThresholdsGroup?.choices.selected?.kind === 'custom'"
      :isRange="selectedReport?.thresholds.inputs.isRequiredARange"
      :value="currentThresholdsGroup.choices.selected?.value || 0"
      :unit="selectedUnit"
      @switch="
        (value) =>
          selectedReport &&
          (selectedReport.thresholds.inputs.isRequiredARange = value)
      "
      @input="
          (value) => {
            if (
              currentThresholdsGroup?.choices.selected &&
              selectedUnit
            ) {
              value = convertValueFromUnitAToUnitB(
                value as number,
                selectedUnit.currentUnit,
                selectedUnit.baseUnit
              )
              
              // value =
              //   value < selectedUnit.min
              //     ? selectedUnit.min
              //     : selectedUnit.max && value > selectedUnit.max
              //     ? selectedUnit.max
              //     : value

              ;(currentThresholdsGroup.choices.selected as CustomThreshold).value = value

              if (
                currentThresholdsGroup.choices.selected.kind === 'custom' &&
                currentThresholdsGroup.choices.selected.valueHigh < value
              ) {
                currentThresholdsGroup.choices.selected.valueHigh = value
              }
            }
          }
        "
    />
    <div
      class="space-y-2"
      v-if="
        currentThresholdsGroup?.choices.selected?.kind === 'custom' &&
        currentThresholdsGroup.choices.selected.type !== 'Bicolor'
      "
    >
      <ListboxColors
        v-if="currentThresholdsGroup.choices.selected.type === 'Tricolor'"
        :icon="IconColorSwatch"
        :color="selectedReport.thresholds.colors.middle"
        @selectColor="(color: ColorName) => {
          selectedReport && (selectedReport.thresholds.colors.middle = color)
        }"
        :text="`${formattedTresholdValue} ≤ ${t(
          selectedDataLabel?.name || ''
        )} < ${formattedTresholdValueHigh}`"
      />
      <Button
        v-else
        :leftIcon="'span'"
        as="div"
        full
        :style="[
          `color: ${blend(
            blend(
              colorsClasses[selectedReport.thresholds.colors.low].hexColor,
              colorsClasses[selectedReport.thresholds.colors.high].hexColor
            ),
            '#000000',
            0.75
          )}`,
          `background: linear-gradient(180deg,${
            colorsClasses[selectedReport.thresholds.colors.low].hexColor
          },${colorsClasses[selectedReport.thresholds.colors.high].hexColor})`,
        ]"
      >
        {{
          `${formattedTresholdValue} ≤ ${t(
            selectedDataLabel?.name || ''
          )} < ${formattedTresholdValueHigh}`
        }}
      </Button>

      <InputNumberSwitchable
        :isRange="selectedReport?.thresholds.inputs.isOptionalARange"
        :value="currentThresholdsGroup.choices.selected?.valueHigh || 0"
        :unit="selectedUnit"
        @switch="
          (value) =>
            selectedReport &&
            (selectedReport.thresholds.inputs.isOptionalARange = value)
        "
        @input="
            (value) => {
              if (
                selectedUnit &&
                currentThresholdsGroup?.choices.selected?.kind === 'custom'
              ) {
                value = convertValueFromUnitAToUnitB(
                  value as number,
                  selectedUnit.currentUnit,
                  selectedUnit.baseUnit
                )

                currentThresholdsGroup.choices.selected.valueHigh = value

                if (
                  currentThresholdsGroup.choices.selected.value >
                  currentThresholdsGroup.choices.selected.valueHigh
                ) {
                  currentThresholdsGroup.choices.selected.value = value
                }
              }
            }
          "
      />
    </div>
    <ListboxColors
      :icon="IconColorSwatch"
      :color="selectedReport.thresholds.colors.high"
      @selectColor="(color: ColorName) => {
          selectedReport && (selectedReport.thresholds.colors.high = color)
        }"
      :text="`${
        currentThresholdsGroup?.choices.selected?.kind === 'custom' &&
        currentThresholdsGroup?.choices.selected.type !== 'Tricolor'
          ? formattedTresholdValue
          : formattedTresholdValueHigh
      } ≤ ${t(selectedDataLabel?.name || '')} ≤ ${
        selectedUnit.max
          ? convertValueFromUnitAToUnitB(
              selectedUnit.max,
              selectedUnit.baseUnit,
              selectedUnit.currentUnit
            ).toLocaleString()
          : '∞'
      } ${selectedUnit?.currentUnit}`"
    />
  </div>
</template>
