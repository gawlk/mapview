<script setup lang="ts">
  import { numberToLocaleString } from '/src/locales'

  import store from '/src/store'

  import { convertValueFromUnitAToUnitB } from '/src/scripts'

  import IconCheck from '~icons/tabler/check'
  import IconX from '~icons/tabler/x'

  import Dialog from '/src/components/Dialog.vue'
  import Input from '/src/components/Input.vue'
  import Label from '/src/components/Label.vue'
  import Listbox from '/src/components/Listbox.vue'
  import Switch from '/src/components/Switch.vue'

  const { t } = useI18n()

  const state = reactive({
    isOpen: false,
  })

  const convertValue = (value: number, unit: MathUnit<string>) =>
    Math.round(
      convertValueFromUnitAToUnitB(value, unit.baseUnit, unit.currentUnit) *
        100000
    ) / 100000

  //     {
  //   readonly load: {
  //     active: boolean
  //     loadReferenceSource: SelectableList<
  //       LoadReferenceSourceValue,
  //       LoadReferenceSourceList
  //     >
  //     customValue: MathNumber
  //   }
  //   readonly temperature: {
  //     active: boolean
  //     temperatureFromSource: SelectableList<
  //       TemperatureFromSourceValue,
  //       TemperatureFromSourceList
  //     >
  //     average: SelectableList<TemperatureAverageValue, TemperatureAverageList>
  //     customValue: MathNumber
  //     temperatureTo: number
  //     structureType: SelectableList<
  //       TemperatureStructureTypeValue,
  //       TemperatureStructureTypeList
  //     >
  //   }
  // }

  const selectedProject = computed(
    () => store.selectedProject as HeavydynProject | null
  )
</script>

<template>
  <div class="space-y-2">
    <h5 class="pl-4 font-medium text-gray-700">
      {{ t('Load') }}
    </h5>
    <div class="space-y-2">
      <Label>
        {{ t('Active') }}
      </Label>
      <Switch
        :value="selectedProject?.correctionParameters.load.active || false"
        @input="
          (value) =>
            selectedProject &&
            (selectedProject.correctionParameters.load.active = value)
        "
        :left-icon="IconX"
        :right-icon="IconCheck"
      />
    </div>
    <Listbox
      class="flex-1"
      :values="
        selectedProject?.correctionParameters.load.loadReferenceSource.list.map(
          (str) => t(str)
        )
      "
      :selected="
        t(
          selectedProject?.correctionParameters.load.loadReferenceSource
            .selected || ''
        )
      "
      @select-index="
        (index) =>
          selectedProject?.correctionParameters.load.loadReferenceSource.selectIndex(
            index
          )
      "
      full
    />
    <Input
      :id="`load-custom-value`"
      :label="`Custom value`"
      :value="
        selectedProject
          ? convertValue(
              selectedProject.correctionParameters.load.customValue.value,
              selectedProject.correctionParameters.load.customValue.unit
            )
          : 0
      "
      type="number"
      :step="0.00001"
      @input="
        (value) => {
          if (selectedProject) {
            selectedProject.correctionParameters.load.customValue.value =
              convertValueFromUnitAToUnitB(
                Number(value),
                selectedProject.correctionParameters.load.customValue.unit
                  .currentUnit,
                selectedProject.correctionParameters.load.customValue.unit
                  .baseUnit
              )
          }
        }
      "
    />
  </div>
  <div class="space-y-2">
    <h5 class="pl-4 font-medium text-gray-700">
      {{ t('Temperature') }}
    </h5>
    <div class="space-y-2">
      <Label>
        {{ t('Active') }}
      </Label>
      <Switch
        :value="
          selectedProject?.correctionParameters.temperature.active || false
        "
        @input="
          (value) =>
            selectedProject &&
            (selectedProject.correctionParameters.temperature.active = value)
        "
        :left-icon="IconX"
        :right-icon="IconCheck"
      />
      <div class="space-y-1">
        <Label>{{ t('Source') }}</Label>
        <Listbox
          class="flex-1"
          :values="
            selectedProject?.correctionParameters.temperature.temperatureFromSource.list.map(
              (str) => t(str)
            )
          "
          :selected="
            t(
              selectedProject?.correctionParameters.temperature
                .temperatureFromSource.selected || ''
            )
          "
          @select-index="
            (index) =>
              selectedProject?.correctionParameters.temperature.temperatureFromSource.selectIndex(
                index
              )
          "
          full
        />
      </div>
      <div class="space-y-1">
        <Label>{{ t('Average') }}</Label>
        <Listbox
          class="flex-1"
          :values="
            selectedProject?.correctionParameters.temperature.average.list.map(
              (str) => t(str)
            )
          "
          :selected="
            t(
              selectedProject?.correctionParameters.temperature.average
                .selected || ''
            )
          "
          @select-index="
            (index) =>
              selectedProject?.correctionParameters.temperature.average.selectIndex(
                index
              )
          "
          full
        />
      </div>
      <!-- TODO: Clean create special case for a math unit in the Input component -->
      <Input
        :id="`temp-custom-value`"
        :label="`Custom value`"
        :value="
          selectedProject
            ? convertValue(
                selectedProject.correctionParameters.temperature.customValue
                  .value,
                selectedProject.correctionParameters.temperature.customValue
                  .unit
              )
            : 0
        "
        type="number"
        :step="0.00001"
        @input="
          (value) => {
            if (selectedProject) {
              selectedProject.correctionParameters.temperature.customValue.value =
                convertValueFromUnitAToUnitB(
                  Number(value),
                  selectedProject.correctionParameters.temperature.customValue
                    .unit.currentUnit,
                  selectedProject.correctionParameters.temperature.customValue
                    .unit.baseUnit
                )
            }
          }
        "
      />
      <Input
        :id="`temp-to`"
        :label="`Temperature to`"
        :value="
          selectedProject
            ? convertValue(
                selectedProject.correctionParameters.temperature.temperatureTo
                  .value,
                selectedProject.correctionParameters.temperature.temperatureTo
                  .unit
              )
            : 0
        "
        type="number"
        :step="0.00001"
        @input="
          (value) => {
            if (selectedProject) {
              selectedProject.correctionParameters.temperature.temperatureTo.value =
                convertValueFromUnitAToUnitB(
                  Number(value),
                  selectedProject.correctionParameters.temperature.temperatureTo
                    .unit.currentUnit,
                  selectedProject.correctionParameters.temperature.temperatureTo
                    .unit.baseUnit
                )
            }
          }
        "
      />
      <div class="space-y-1">
        <Label>{{ t('Structure') }}</Label>
        <Listbox
          class="flex-1"
          :values="
            selectedProject?.correctionParameters.temperature.structureType.list.map(
              (obj) => t(obj.name)
            )
          "
          :selected="
            t(
              selectedProject?.correctionParameters.temperature.structureType
                .selected?.name || ''
            )
          "
          @select-index="
            (index) =>
              selectedProject?.correctionParameters.temperature.structureType.selectIndex(
                index
              )
          "
          full
        />
      </div>
    </div>
  </div>
</template>
