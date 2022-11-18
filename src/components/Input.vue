<script setup lang="ts">
  import { getBrowserLocale } from '/src/locales'

  import Label from './Label.vue'
  import Listbox from './Listbox.vue'

  const emit = defineEmits<{
    (event: 'input', value: string | number): void
  }>()

  const props = defineProps<{
    readonly id: string
    readonly value: string | number
    readonly type?: string
    readonly label?: string
    readonly step?: number
    readonly min?: number
    readonly max?: number
    readonly list?: any
    readonly strict?: boolean
    readonly disabled?: boolean
  }>()

  const { t } = useI18n()

  const classes = `
    w-full
    flex-1
    py-2
    px-3.5
    rounded-lg
    leading-5
    border-2 border-gray-100
    hover:border-gray-200
    focus:border-gray-200
    focus:ring-gray-50
    placeholder-gray-500
    focus:ring
    focus:outline-none
    transition-colors
    duration-200
    disabled:bg-gray-50
  `
</script>

<template>
  <div class="w-full space-y-1">
    <Label v-if="props.label">{{ props.label }}</Label>
    <div class="flex space-x-2" v-if="props.type === 'slidableNumber'">
      <input
        :id="`${props.id}-number`"
        @input="(event) => emit('input', Number((event.target as HTMLInputElement).value))"
        type="number"
        :value="props.value"
        :min="props.min"
        :max="props.max"
        :step="props.step"
        :disabled="props.disabled"
        :class="classes"
      />
      <input
        class="px-0 focus:ring-0"
        :id="`${props.id}-range`"
        @input="(event) => emit('input', Number((event.target as HTMLInputElement).value))"
        type="range"
        :value="props.value"
        :max="props.max"
        :min="props.min"
        :step="props.step"
        :disabled="props.disabled"
        :class="classes"
      />
    </div>
    <div v-if="props.type === 'selectableString' && !props.strict">
      <input
        class="w-full flex-1"
        :id="`${props.id}-text`"
        :name="`${props.id}-text`"
        :list="`${props.id}-datalist`"
        @input="(event) => emit('input', (event.target as HTMLInputElement).value)"
        :value="props.value"
        :disabled="props.disabled"
        :class="classes"
      />
      <datalist :id="`${props.id}-datalist`">
        <option v-for="value of props.list" :value="t(value)" />
      </datalist>
    </div>
    <Listbox
      class="flex-1"
      v-else-if="props.type === 'selectableString' && props.strict"
      :values="props.list"
      :selected="props.value"
      @select="(value) => emit('input', value)"
      full
      :disabled="props.disabled"
    />
    <textarea
      v-else-if="props.type === 'longString'"
      @input="(event) => emit('input', (event.target as HTMLInputElement).value)"
      :id="props.id"
      rows="3"
      :value="props.value"
      :disabled="props.disabled"
      :class="classes"
    />
    <input
      v-else-if="props.type === 'dateValue'"
      :id="props.id"
      disabled
      :value="new Date(props.value).toLocaleDateString(getBrowserLocale())"
      :class="classes"
    />
    <div class="flex h-10 items-center" v-else>
      <input
        @input="
        (event) =>
          emit(
            'input',
            props.type === 'number'
              ? Number((event.target as HTMLInputElement).value)
              : (event.target as HTMLInputElement).value
          )
      "
        :id="props.id"
        :type="props.type"
        :value="props.value"
        :min="props.min"
        :max="props.max"
        :step="props.step"
        :disabled="props.disabled"
        :class="classes"
      />
    </div>
  </div>
</template>
