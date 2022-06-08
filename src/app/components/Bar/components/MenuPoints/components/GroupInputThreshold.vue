<script setup lang="ts">
  import { convertValueFromUnitAToUnitB } from '/src/scripts'

  import IconAdjustments from '~icons/heroicons-solid/adjustments'
  import IconPencilAlt from '~icons/heroicons-solid/pencil-alt'

  import Switch from '/src/components/Switch.vue'
  import Input from '/src/components/Input.vue'

  const emit = defineEmits<{
    (event: 'switch', value: boolean): void
    (event: 'input', value: number): void
  }>()

  const props = defineProps<{
    value: number
    isRange: boolean
    unit: MathUnit
  }>()
</script>

<template>
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
        String(
          convertValueFromUnitAToUnitB(
            props.value,
            props.unit.baseUnit,
            props.unit.currentUnit
          )
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
</template>
