<script setup lang="ts">
  import { isMobile } from '/src/scripts'

  import Button from '/src/components/Button.vue'

  import IconSelector from '~icons/heroicons-solid/selector'

  const emit = defineEmits<{
    (e: 'select', value: string): void
    (e: 'selectIndex', value: number): void
  }>()

  const props = defineProps<{
    values?: string[]
    selected?: string | number | string[]
    selectedIndex?: number
    icon?: any
    preSelected?: string
    selectedReplacement?: string
    full?: boolean
    classes?: string[]
    iconsClasses?: string
    postSelected?: string
    sm?: boolean
    multiple?: boolean
    selectedList?: string[]
  }>()

  const { t } = useI18n()

  const state = reactive({
    showMultiple: false,
  })

  const select = (value: string) => {
    emit('select', value)

    const list = props.values || props.classes

    list && emit('selectIndex', list.indexOf(value))
  }

  const getIndex = (value: string) => {
    if (!props.multiple) {
      return ''
    }

    const index = props.selectedList?.findIndex((v) => v === value)

    return typeof index === 'number' && index !== -1
      ? ` (${t('Column')} ${index + 1})`
      : ''
  }

  const getDifference = (arr1: string[], arr2: string[]) => {
    const v = arr1.filter((v) => !arr2.includes(v))[0]
    return v || arr2.filter((v) => !arr1.includes(v))[0]
  }
</script>

<template>
  <div
    v-if="!(!isMobile() && props.multiple)"
    :class="[
      props.full && 'w-full',
      props.sm
        ? 'space-x-1 rounded-md py-0.5 px-1.5'
        : 'space-x-3 rounded-lg py-2 px-4',
    ]"
    class="group relative flex h-full w-full items-center justify-between truncate bg-gray-100 text-sm font-medium leading-6 transition-colors duration-200 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300"
  >
    <div class="flex items-center truncate">
      <component
        v-if="props.icon"
        :is="props.icon"
        :class="[
          props.iconsClasses || 'text-gray-400 group-hover:text-gray-500',
        ]"
        class="mr-1 h-5 w-5 flex-none transition-colors duration-200"
      />
      <span v-if="props.preSelected" class="ml-1 text-gray-500">
        {{ props.preSelected }}
      </span>
      <span
        v-if="props.selectedReplacement || props.values"
        class="ml-1 truncate"
        v-html="
              props.selectedReplacement ||
              props.multiple ?
              props.selectedList?.join(', ') :
              (props.selected !== undefined && props.values?.includes(props.selected as string)
                ? props.selected
                : props.values?.[props.selectedIndex || 0])
            "
      />
      <span
        v-if="props.postSelected"
        class="ml-1 hidden text-gray-500 sm:block"
      >
        {{ props.postSelected }}
      </span>
    </div>
    <div>
      <IconHeroiconsSolidSelector
        :class="[
          props.iconsClasses || 'text-gray-400 group-hover:text-gray-500',
        ]"
        class="h-5 w-5 transition-colors duration-200"
        aria-hidden="true"
      />
    </div>
    <select
      :multiple="props.multiple"
      @change="(event) => select(props.multiple ? getDifference(Array.from((event.target as HTMLSelectElement).selectedOptions).map((option) => option.value), props.selectedList || []) : (event.target as HTMLSelectElement).value)"
      class="absolute inset-0 z-10 !m-0 w-full cursor-pointer appearance-none bg-transparent text-transparent focus:outline-none disabled:cursor-default"
    >
      <option
        v-for="value in props.values"
        :value="value"
        class="text-black"
        :selected="
          props.multiple
            ? props.selectedList?.includes(value)
            : props.selected === value
        "
      >
        {{ value }}{{ getIndex(value) }}
      </option>
    </select>
  </div>
  <div v-else class="space-y-2">
    <Button
      full
      :leftIcon="props.icon"
      :rightIcon="IconSelector"
      @click="() => (state.showMultiple = !state.showMultiple)"
      truncate
    >
      <span v-if="props.preSelected" class="ml-1 text-gray-500">
        {{ props.preSelected }}
      </span>
      <span
        v-if="props.selectedReplacement || props.values"
        class="ml-1 truncate"
        v-html="props.selectedList?.join(', ')"
      />
      <span
        v-if="props.postSelected"
        class="ml-1 hidden text-gray-500 sm:block"
      >
        {{ props.postSelected }}
      </span>
    </Button>
    <select
      v-if="state.showMultiple"
      @change="log"
      @click="(event) => select((event.target as HTMLSelectElement).value)"
      :multiple="props.multiple"
      class="h-40 w-full cursor-pointer appearance-none space-y-1 rounded-lg border-2 border-gray-100 bg-transparent p-2 text-transparent focus:outline-none disabled:cursor-default"
    >
      <option
        v-for="value in props.values"
        :value="value"
        class="flex appearance-none space-x-2 rounded-md px-3 py-1.5 text-sm font-medium text-black focus:bg-orange-200 [&:selected]:!bg-gray-200"
        :selected="props.selectedList?.includes(value)"
      >
        <!-- <IconHeroiconsSolidCheck class="h-5 w-5 [&]" aria-hidden="true" /> -->
        <span> {{ value }}{{ getIndex(value) }} </span>
      </option>
    </select>
  </div>
</template>
