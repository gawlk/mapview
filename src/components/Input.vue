<template>
  <div class="w-full space-y-1">
    <Label v-if="props.label">{{ props.label }}</Label>
    <div v-if="props.type === 'slidableNumber'" class="flex space-x-2">
      <input
        :id="`${props.id}-number`"
        @input="(event) => emit('input', Number(event.target.value))"
        type="number"
        :value="props.value"
        :min="props.min"
        :max="props.max"
        :step="props.step"
        :class="classes"
      />
      <input
        :id="`${props.id}-range`"
        @input="(event) => emit('input', Number(event.target.value))"
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
        @input="(event) => emit('input', event.target.value)"
        :value="props.value"
        :class="classes"
        class="flex-1 w-full"
      />
      <Listbox
        :values="props.list"
        :selected="props.value"
        @select="(value) => emit('input', value)"
        full
        listTop
        class="flex-1"
      />
    </div>
    <textarea
      v-else-if="props.type === 'longString'"
      @input="(event) => emit('input', event.target.value)"
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
    <input
      v-else
      @input="
        (event) =>
          emit(
            'input',
            props.type === 'number'
              ? Number(event.target.value)
              : event.target.value
          )
      "
      :id="props.id"
      :type="props.type"
      :value="props.value"
      :min="props.min"
      :max="props.max"
      :class="classes"
    />
  </div>
</template>

<script setup lang="ts">
  import { defineEmit, defineProps } from 'vue'

  import { getBrowserLocale } from '/src/locales'

  import { Label, Listbox } from '.'

  const emit = defineEmit(['input'])

  const props = defineProps({
    id: String,
    label: String,
    type: String,
    value: String | Number,
    step: Number,
    min: Number,
    max: Number,
    list: Array,
    strict: Boolean,
  })

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
