<script setup lang="ts">
  import { numberToLocaleString } from '/src/locales'
  import { convertValueFromUnitAToUnitB } from '/src/scripts'

  import IconAdjustments from '~icons/heroicons-solid/adjustments'
  import IconPencilAlt from '~icons/heroicons-solid/pencil-alt'

  import Input from '/src/components/Input.vue'
  import Label from './Label.vue'
  import Switch from '/src/components/Switch.vue'

  const emit = defineEmits<{
    (event: 'switch', value: boolean): void
    (event: 'input', value: number): void
  }>()

  const props = defineProps<{
    readonly value: number
    readonly isRange: boolean
    readonly unit: MathUnit<string>
    readonly label?: string
  }>()
</script>

<template>
  <div class="w-full space-y-1">
    <Label v-if="props.label">{{ props.label }}</Label>
    <div class="flex space-x-2">
      <Switch
        :leftIcon="IconPencilAlt"
        :rightIcon="IconAdjustments"
        :value="props.isRange"
        @input="(value) => emit('switch', value)"
      />
      <Input
        :id="`threshold-input-${Math.random()}`"
        @input="(value) => emit('input', Number(value))"
        :value="
          numberToLocaleString(
            convertValueFromUnitAToUnitB(
              props.value,
              props.unit.baseUnit,
              props.unit.currentUnit
            ),
            {
              locale: 'en-US',
              precision: unit.currentPrecision,
            }
          )
        "
        :type="props.isRange ? 'range' : 'number'"
        :step="props.unit.step"
        :min="
          convertValueFromUnitAToUnitB(
            props.unit.min,
            props.unit.baseUnit,
            props.unit.currentUnit
          )
        "
        :max="
          props.unit.max
            ? convertValueFromUnitAToUnitB(
                props.unit.max,
                props.unit.baseUnit,
                props.unit.currentUnit
              )
            : 1000
        "
      />
    </div>
  </div>
</template>
