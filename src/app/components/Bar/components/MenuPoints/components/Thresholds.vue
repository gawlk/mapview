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

  const currentGroupedThresholds = computed(
    () =>
      selectedReport.value &&
      (Object.values(selectedReport.value.thresholds.groups).find(
        (group: GroupedThresolds<string>) =>
          group.unit === selectedDataLabel.value?.unit
      ) as GroupedThresolds<string>)
  )

  const formattedTresholdValue = computed(
    () =>
      `${
        currentGroupedThresholds.value?.choices.selected && selectedUnit.value
          ? convertValueFromUnitAToUnitB(
              currentGroupedThresholds.value.choices.selected.value,
              selectedUnit.value.baseUnit,
              selectedUnit.value.currentUnit
            ).toLocaleString()
          : '?'
      } ${selectedUnit.value?.currentUnit}`
  )

  const formattedTresholdValueHigh = computed(
    () =>
      `${
        currentGroupedThresholds.value?.choices.selected && selectedUnit.value
          ? convertValueFromUnitAToUnitB(
              currentGroupedThresholds.value.choices.selected.kind === 'custom'
                ? currentGroupedThresholds.value.choices.selected.valueHigh
                : currentGroupedThresholds.value.choices.selected.value,
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
        currentGroupedThresholds?.choices.list.map((threshold) =>
          t(threshold.name)
        )
      "
      @selectIndex="
        (index) =>
          currentGroupedThresholds &&
          (currentGroupedThresholds.choices.selected =
            currentGroupedThresholds.choices.list[index])
      "
      :preSelected="`${t('Selected')}${t(':')}`"
      :selected="t(currentGroupedThresholds?.choices.selected?.name || '')"
      full
    />
    <Divider
      v-if="currentGroupedThresholds?.choices.selected?.kind === 'custom'"
    />
    <Listbox
      v-if="currentGroupedThresholds?.choices.selected?.kind === 'custom'"
      :icon="IconColorSwatch"
      :values="[t('Bicolor'), t('Gradient'), t('Tricolor')]"
      @selectIndex="
        (index) =>
          currentGroupedThresholds &&
          currentGroupedThresholds.choices.selected?.kind === 'custom' &&
          (currentGroupedThresholds.choices.selected.type =
            index === 0 ? 'Bicolor' : index === 1 ? 'Gradient' : 'Tricolor')
      "
      :preSelected="`${t('Type')}${t(':')}`"
      :selected="t(currentGroupedThresholds?.choices.selected.type)"
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
      v-if="currentGroupedThresholds?.choices.selected?.kind === 'custom'"
      :isRange="selectedReport?.thresholds.inputs.isRequiredARange"
      :value="currentGroupedThresholds.choices.selected?.value || 0"
      :unit="selectedUnit"
      @switch="
        (value) =>
          selectedReport &&
          (selectedReport.thresholds.inputs.isRequiredARange = value)
      "
      @input="
          (value) => {
            if (
              currentGroupedThresholds?.choices.selected &&
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

              ;(currentGroupedThresholds.choices.selected as CustomThreshold).value = value

              if (
                currentGroupedThresholds.choices.selected.kind === 'custom' &&
                currentGroupedThresholds.choices.selected.valueHigh < value
              ) {
                currentGroupedThresholds.choices.selected.valueHigh = value
              }
            }
          }
        "
    />
    <div
      class="space-y-2"
      v-if="
        currentGroupedThresholds?.choices.selected?.kind === 'custom' &&
        currentGroupedThresholds.choices.selected.type !== 'Bicolor'
      "
    >
      <ListboxColors
        v-if="currentGroupedThresholds.choices.selected.type === 'Tricolor'"
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
        :value="currentGroupedThresholds.choices.selected?.valueHigh || 0"
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
                currentGroupedThresholds?.choices.selected?.kind === 'custom'
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

                currentGroupedThresholds.choices.selected.valueHigh = value

                if (
                  currentGroupedThresholds.choices.selected.value >
                  currentGroupedThresholds.choices.selected.valueHigh
                ) {
                  currentGroupedThresholds.choices.selected.value = value
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
        currentGroupedThresholds?.choices.selected?.kind === 'custom' &&
        currentGroupedThresholds?.choices.selected.type !== 'Tricolor'
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
