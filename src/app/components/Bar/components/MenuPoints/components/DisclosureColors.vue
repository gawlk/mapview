<script setup lang="ts">
  import store from '/src/store'
  import {
    createZone,
    setDisclosureOpenState,
    getDisclosureOpenState,
    convertValueFromBaseUnitToCurrentUnit,
    convertValueFromCurrentUnitToBaseUnit,
    blend,
    colorsClasses,
  } from '/src/scripts'

  import IconColorSwatch from '~icons/heroicons-solid/color-swatch'
  import IconAdjustments from '~icons/heroicons-solid/adjustments'
  import IconPlus from '~icons/heroicons-solid/plus'
  import IconTrash from '~icons/heroicons-solid/trash'
  import IconCog from '~icons/heroicons-solid/cog'
  import IconIssueDraft from '~icons/octicon/issue-draft-16'
  import IconFold from '~icons/octicon/fold-16'
  import IconPencilAlt from '~icons/heroicons-solid/pencil-alt'
  import Button from '/src/components/Button.vue'

  const { t } = useI18n()

  const key = 'isPointsColorsDisclosureOpen'

  const selectedReport = computed(
    () => store.projects.selected?.reports.selected
  )

  const selectedDataLabel = computed(
    () => selectedReport.value?.dataLabels.groups.selected?.choices.selected
  )

  const currentGroupedThresholds = computed(() =>
    selectedReport.value?.thresholds.groups.find(
      (group) => group.unit === selectedDataLabel.value?.unit
    )
  )

  const formattedTresholdValue = computed(
    () =>
      `${
        currentGroupedThresholds.value?.choices.selected &&
        selectedDataLabel.value
          ? convertValueFromBaseUnitToCurrentUnit(
              currentGroupedThresholds.value.choices.selected.value,
              selectedDataLabel.value.unit
            ).toLocaleString()
          : '?'
      } ${selectedDataLabel.value?.unit.currentUnit}`
  )

  const formattedTresholdValueHigh = computed(
    () =>
      `${
        currentGroupedThresholds.value?.choices.selected &&
        selectedDataLabel.value
          ? convertValueFromBaseUnitToCurrentUnit(
              currentGroupedThresholds.value.choices.selected.kind === 'custom'
                ? currentGroupedThresholds.value.choices.selected.valueHigh
                : currentGroupedThresholds.value.choices.selected.value,
              selectedDataLabel.value.unit
            )?.toLocaleString()
          : '?'
      } ${selectedDataLabel.value?.unit.currentUnit}`
  )
</script>

<template>
  <Disclosure
    :icon="IconColorSwatch"
    :text="t('Colors settings')"
    @click="(open) => setDisclosureOpenState(key, open)"
    :defaultOpen="getDisclosureOpenState(key)"
  >
    <Listbox
      :icon="IconAdjustments"
      :values="[t('Colorization by threshold'), t('Colorization by zone')]"
      :selectedIndex="
        selectedReport?.settings.selectedColorization === 'Threshold' ? 0 : 1
      "
      @selectIndex="
        (index) =>
          selectedReport &&
          (selectedReport.settings.selectedColorization =
            index === 0 ? 'Threshold' : 'Zone')
      "
      full
    />
    <Divider />
    <div
      v-if="selectedReport?.settings.selectedColorization === 'Threshold'"
      class="space-y-2"
    >
      <Listbox
        :icon="IconFold"
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
        :preSelected="`${t('Threshold')}${t(':')}`"
        :selected="t(currentGroupedThresholds?.choices.selected.name)"
        full
      />
      <Listbox
        v-if="currentGroupedThresholds?.choices.selected?.kind === 'custom'"
        :icon="IconCog"
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
        :text="`0 ${selectedDataLabel?.unit.currentUnit} ≤ ${t(
          selectedDataLabel?.name || ''
        )} < ${formattedTresholdValue}`"
      />
      <div
        v-if="currentGroupedThresholds.choices.selected?.kind === 'custom'"
        class="flex space-x-2"
      >
        <Switch
          :leftIcon="IconPencilAlt"
          :rightIcon="IconAdjustments"
          :value="selectedReport.thresholds.inputs.isRequiredARange"
          @input="
            (value) =>
              (selectedReport.thresholds.inputs.isRequiredARange = value)
          "
        />
        <Input
          id="threshold-input"
          @input="
            (value) => {
              if (currentGroupedThresholds.choices.selected) {
                value = convertValueFromCurrentUnitToBaseUnit(
                  value,
                  selectedDataLabel.unit
                )

                value =
                  value < selectedDataLabel.unit.min
                    ? selectedDataLabel.unit.min
                    : value > selectedDataLabel.unit.max
                    ? selectedDataLabel.unit.max
                    : value

                currentGroupedThresholds.choices.selected.value = value

                if (
                  currentGroupedThresholds.choices.selected.kind === 'custom' &&
                  currentGroupedThresholds.choices.selected.valueHigh < value
                ) {
                  currentGroupedThresholds.choices.selected.valueHigh = value
                }
              }
            }
          "
          :value="
            String(
              convertValueFromBaseUnitToCurrentUnit(
                currentGroupedThresholds.choices.selected?.value,
                selectedDataLabel.unit
              )
            )
          "
          :type="
            selectedReport.thresholds.inputs.isRequiredARange
              ? 'range'
              : 'number'
          "
          :step="selectedDataLabel.unit.step"
          :min="
            convertValueFromBaseUnitToCurrentUnit(
              selectedDataLabel.unit.min,
              selectedDataLabel.unit
            )
          "
          :max="
            convertValueFromBaseUnitToCurrentUnit(
              selectedDataLabel.unit.max,
              selectedDataLabel.unit
            )
          "
        />
      </div>
      <div
        v-if="
          currentGroupedThresholds.choices.selected?.kind === 'custom' &&
          currentGroupedThresholds.choices.selected.type !== 'Bicolor'
        "
        class="space-y-2"
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
            },${
              colorsClasses[selectedReport.thresholds.colors.high].hexColor
            })`,
          ]"
        >
          {{
            `${formattedTresholdValue} ≤ ${t(
              selectedDataLabel?.name || ''
            )} < ${formattedTresholdValueHigh}`
          }}
        </Button>
        <div class="flex space-x-2">
          <Switch
            :leftIcon="IconPencilAlt"
            :rightIcon="IconAdjustments"
            :value="selectedReport.thresholds.inputs.isOptionalARange"
            @input="
              (value) =>
                (selectedReport.thresholds.inputs.isOptionalARange = value)
            "
          />
          <Input
            id="threshold-high-input"
            @input="
              (value) => {
                if (
                  currentGroupedThresholds.choices.selected?.kind === 'custom'
                ) {
                  value = convertValueFromCurrentUnitToBaseUnit(
                    value,
                    selectedDataLabel.unit
                  )

                  value =
                    value < selectedDataLabel.unit.min
                      ? selectedDataLabel.unit.min
                      : value > selectedDataLabel.unit.max
                      ? selectedDataLabel.unit.max
                      : value

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
            :value="
              String(
                convertValueFromBaseUnitToCurrentUnit(
                  currentGroupedThresholds.choices.selected?.valueHigh,
                  selectedDataLabel.unit
                )
              )
            "
            :type="
              selectedReport.thresholds.inputs.isOptionalARange
                ? 'range'
                : 'number'
            "
            :step="selectedDataLabel.unit.step"
            :min="
              convertValueFromBaseUnitToCurrentUnit(
                selectedDataLabel.unit.min,
                selectedDataLabel.unit
              )
            "
            :max="
              convertValueFromBaseUnitToCurrentUnit(
                selectedDataLabel.unit.max,
                selectedDataLabel.unit
              )
            "
          />
        </div>
      </div>
      <ListboxColors
        :icon="IconColorSwatch"
        :color="selectedReport.thresholds.colors.high"
        @selectColor="(color: ColorName) => {
          selectedReport && (selectedReport.thresholds.colors.high = color)
        }"
        :text="`${
          currentGroupedThresholds.choices.selected?.kind === 'custom' &&
          currentGroupedThresholds.choices.selected.type !== 'Tricolor'
            ? formattedTresholdValue
            : formattedTresholdValueHigh
        } ≤ ${t(selectedDataLabel?.name || '')} < ∞ ${
          selectedDataLabel?.unit.currentUnit
        }`"
      />
    </div>
    <div v-else class="space-y-2">
      <div
        v-for="(zone, index) of selectedReport?.zones"
        class="flex space-x-2"
      >
        <ListboxColors
          :icon="IconIssueDraft"
          @selectColor="(color: ColorName) => 
            (zone.color = color)
          "
          :color="zone.color"
        />
        <Input
          :id="zone.name + '-name'"
          :value="zone.name"
          @input="(value) => (zone.name = String(value))"
        />
        <Button
          @click="selectedReport?.zones.splice(index, 1)"
          :icon="IconTrash"
        />
      </div>
      <Button
        full
        :leftIcon="IconPlus"
        @click="
          () => {
            selectedReport?.zones.push(
              createZone({
                name: `${t('Zone')} ${selectedReport?.zones.length + 1}`,
                isVisible: true,
              })
            )
          }
        "
      >
        {{ t('Create a zone') }}
      </Button>
    </div>
  </Disclosure>
</template>

<i18n lang="yaml">
fr:
  'Colors settings': 'Configurations des couleurs'
  'Colorization by threshold': 'Colorisation par seuil'
  'Colorization by zone': 'Colorisation par zone'
  'Create a zone': 'Créer une zone'
</i18n>
