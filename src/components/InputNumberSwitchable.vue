<script setup lang="ts">
  import { numberToLocaleString } from '/src/locales'

  import { convertValueFromUnitAToUnitB } from '/src/scripts'

  import IconAdjustments from '~icons/heroicons-solid/adjustments'
  import IconPencilAlt from '~icons/heroicons-solid/pencil-alt'

  import Input from '/src/components/Input.vue'
  import Switch from '/src/components/Switch.vue'

  import Label from './Label.vue'

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

  const convertValue = (value: number) =>
    Math.round(
      convertValueFromUnitAToUnitB(
        value,
        props.unit.baseUnit,
        props.unit.currentUnit
      ) * 100000
    ) / 100000
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
        :id="`threshold-input-${label}`"
        @input="(value) => props.isRange && emit('input', Number(value))"
        @focusout="(event: Event) => props.isRange || emit('input', Number((event.target as HTMLInputElement).value))"
        :value="convertValue(props.value)"
        :type="props.isRange ? 'range' : 'number'"
        :step="10 ** (props.unit.currentPrecision * -1)"
        :min="props.isRange ? convertValue(props.unit.min) : undefined"
        :max="props.isRange ? convertValue(props.unit.max) : undefined"
      />
    </div>
  </div>
</template>
