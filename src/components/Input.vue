<script setup lang="ts">
  import { getBrowserLocale } from '/src/locales'

  import Listbox from '/src/components/Listbox.vue'

  const emit = defineEmits<{
    (event: 'input', value: string | number): void
  }>()

  const props = defineProps<{
    id: string
    value: string | number
    type?: string
    label?: string
    step?: number
    min?: number
    max?: number
    list?: any
    strict?: boolean
  }>()

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
  `
</script>

<template>
  <div class="w-full space-y-1">
    <Label v-if="props.label">{{ props.label }}</Label>
    <div v-if="props.type === 'slidableNumber'" class="flex space-x-2">
      <input
        :id="`${props.id}-number`"
        @input="(event) => emit('input', Number((event.target as HTMLInputElement).value))"
        type="number"
        :value="props.value"
        :min="props.min"
        :max="props.max"
        :step="props.step"
        :class="classes"
      />
      <input
        :id="`${props.id}-range`"
        @input="(event) => emit('input', Number((event.target as HTMLInputElement).value))"
        type="range"
        :max="props.max"
        :min="props.min"
        :value="props.value"
        :step="props.step"
        :class="classes"
        class="px-0 focus:ring-0"
      />
    </div>
    <div v-else-if="props.type === 'selectableString'" class="flex space-x-2">
      <input
        v-if="!props.strict"
        :id="`${props.id}-text`"
        @input="(event) => emit('input', (event.target as HTMLInputElement).value)"
        :value="props.value"
        :class="classes"
        class="w-full flex-1"
      />
      <Listbox
        :values="props.list"
        :selected="props.value"
        @select="(value) => emit('input', value)"
        full
        class="flex-1"
      />
    </div>
    <textarea
      v-else-if="props.type === 'longString'"
      @input="(event) => emit('input', (event.target as HTMLInputElement).value)"
      :id="props.id"
      rows="3"
      :value="props.value"
      :class="classes"
    />
    <input
      v-else-if="props.type === 'date'"
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
        :class="classes"
      />
    </div>
  </div>
</template>
