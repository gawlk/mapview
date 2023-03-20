<script setup lang="ts">
  import store from '/src/store'

  import { ConvertType } from '/src/scripts'

  import IconCheck from '~icons/tabler/check'
  import IconX from '~icons/tabler/x'

  import Input from '/src/components/Input.vue'
  import Label from '/src/components/Label.vue'
  import Listbox from '/src/components/Listbox.vue'
  import Switch from '/src/components/Switch.vue'

  const { t } = useI18n()

  const operations = {
    [ConvertType.BaseToCurrent]: (value: number, unit: MathUnit<string>) =>
      unit.baseToCurrent(value),
    [ConvertType.CurrentToBase]: (value: number, unit: MathUnit<string>) =>
      unit.currentToBase(value),
  }

  const convertValue = (
    value: number,
    unit: MathUnit<string> | undefined,
    type: ConvertType
  ) =>
    Math.round((unit ? operations[type](value, unit) : value) * 100000) / 100000

  const selectedProject = computed(
    () => store.selectedProject as HeavydynProject | null
  )

  function convertInputValue(mathNumber: MathNumber, value: string | number) {
    const unit = mathNumber.unit

    mathNumber.value = convertValue(
      Number(value),
      unit,
      ConvertType.CurrentToBase
    )
  }
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
        selectedProject?.correctionParameters.load.source.list.map((str) =>
          t(str)
        )
      "
      :selected="
        t(selectedProject?.correctionParameters.load.source.selected || '')
      "
      @select-index="
        (index) =>
          selectedProject?.correctionParameters.load.source.selectIndex(index)
      "
      full
    />
    <Input
      :id="`load-custom-value`"
      :label="`${t('Custom value')} (${
        selectedProject?.correctionParameters.load.customValue.unit?.currentUnit
      })`"
      :value="
        selectedProject
          ? convertValue(
              selectedProject.correctionParameters.load.customValue.value,
              selectedProject.correctionParameters.load.customValue.unit,
              ConvertType.BaseToCurrent
            )
          : 0
      "
      type="number"
      :step="0.00001"
      @input="
        (value) =>
          selectedProject &&
          convertInputValue(
            selectedProject.correctionParameters.load.customValue,
            value
          )
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
            selectedProject?.correctionParameters.temperature.source.list.map(
              (str) => t(str)
            )
          "
          :selected="
            t(
              selectedProject?.correctionParameters.temperature.source
                .selected || ''
            )
          "
          @select-index="
            (index) =>
              selectedProject?.correctionParameters.temperature.source.selectIndex(
                index
              )
          "
          full
        />
      </div>
      <div
        class="space-y-1"
        v-if="
          selectedProject?.correctionParameters.temperature.source.selected !==
          'Custom'
        "
      >
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
        v-if="
          selectedProject?.correctionParameters.temperature.source.selected ===
          'Custom'
        "
        :id="`temp-custom-value`"
        :label="t('Custom value')"
        :value="
          selectedProject
            ? convertValue(
                selectedProject.correctionParameters.temperature.customValue
                  .value,
                selectedProject.correctionParameters.temperature.customValue
                  .unit,
                ConvertType.BaseToCurrent
              )
            : 0
        "
        type="number"
        :step="0.00001"
        @input="
          (value) =>
            selectedProject &&
            convertInputValue(
              selectedProject.correctionParameters.temperature.customValue,
              value
            )
        "
      />
      <Input
        :id="`temp-to`"
        :label="t('Reference temperature')"
        :value="
          selectedProject
            ? convertValue(
                selectedProject.correctionParameters.temperature.reference
                  .value,
                selectedProject.correctionParameters.temperature.reference.unit,
                ConvertType.BaseToCurrent
              )
            : 0
        "
        type="number"
        :step="0.00001"
        @input="
          (value) =>
            selectedProject &&
            convertInputValue(
              selectedProject.correctionParameters.temperature.reference,
              value
            )
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
