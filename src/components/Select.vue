<script setup lang="ts">
  import IconSelector from '~icons/heroicons-solid/selector'

  import Button from '/src/components/Button.vue'

  const emit = defineEmits<{
    (e: 'select', value: string): void
    (e: 'selectIndex', value: number): void
  }>()

  const props = defineProps<{
    readonly values?: string[]
    readonly selected?: string | number | string[]
    readonly selectedIndex?: number
    readonly icon?: any
    readonly preSelected?: string
    readonly selectedReplacement?: string
    readonly full?: boolean
    readonly classes?: string[]
    readonly iconsClasses?: string
    readonly postSelected?: string
    readonly sm?: boolean
    readonly multiple?: boolean
    readonly selectedList?: string[]
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
      ? ` - ${t('Column')} ${index + 1}`
      : ''
  }

  const getDifference = (arr1: string[], arr2: string[]) => {
    const v = arr1.filter((v) => !arr2.includes(v))[0]
    return v || arr2.filter((v) => !arr1.includes(v))[0]
  }
</script>

<template>
  <div
    class="group relative flex h-full w-full items-center justify-between truncate bg-gray-100 text-sm font-medium leading-6 transition-colors duration-200 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300"
    v-if="!props.multiple"
    :class="[
      props.full && 'w-full',
      props.sm
        ? 'space-x-1 rounded-md py-0.5 px-1.5'
        : 'space-x-3 rounded-lg py-2 px-4',
    ]"
  >
    <div class="flex items-center truncate">
      <component
        class="mr-1 h-5 w-5 flex-none transition-colors duration-200"
        v-if="props.icon"
        :is="props.icon"
        :class="[
          props.iconsClasses || 'text-gray-400 group-hover:text-gray-500',
        ]"
      />
      <span class="ml-1 text-gray-500" v-if="props.preSelected">
        {{ props.preSelected }}
      </span>
      <span
        class="ml-1 truncate"
        v-if="props.selectedReplacement || props.values"
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
        class="ml-1 hidden text-gray-500 sm:block"
        v-if="props.postSelected"
      >
        {{ props.postSelected }}
      </span>
    </div>
    <div>
      <IconHeroiconsSolidSelector
        class="h-5 w-5 transition-colors duration-200"
        :class="[
          props.iconsClasses || 'text-gray-400 group-hover:text-gray-500',
        ]"
        aria-hidden="true"
      />
    </div>
    <select
      class="absolute inset-0 z-10 !m-0 w-full cursor-pointer appearance-none bg-transparent text-transparent focus:outline-none disabled:cursor-default"
      :multiple="props.multiple"
      @change="(event) => select(props.multiple ? getDifference(Array.from((event.target as HTMLSelectElement).selectedOptions).map((option) => option.value), props.selectedList || []) : (event.target as HTMLSelectElement).value)"
    >
      <option
        class="text-black"
        v-for="(value, index) in props.values"
        :value="value"
        :selected="
          props.multiple
            ? props.selectedList?.includes(value)
            : typeof props.selectedIndex === 'number'
            ? props.selectedIndex === index
            : props.selected === value
        "
      >
        {{ value }}{{ getIndex(value) }}
      </option>
    </select>
  </div>
  <div class="space-y-2" v-else>
    <Button
      full
      :leftIcon="props.icon"
      :rightIcon="IconSelector"
      @click="() => (state.showMultiple = !state.showMultiple)"
      truncate
    >
      <span class="ml-1 text-gray-500" v-if="props.preSelected">
        {{ props.preSelected }}
      </span>
      <span
        class="ml-1 truncate"
        v-if="props.selectedReplacement || props.values"
        v-html="props.selectedList?.join(', ')"
      />
      <span
        class="ml-1 hidden text-gray-500 sm:block"
        v-if="props.postSelected"
      >
        {{ props.postSelected }}
      </span>
    </Button>
    <select
      class="h-40 w-full cursor-pointer appearance-none space-y-1 rounded-lg border-2 border-gray-100 bg-transparent p-2 text-transparent focus:outline-none disabled:cursor-default"
      v-if="state.showMultiple"
      @click="(event) => select((event.target as HTMLSelectElement).value)"
      :multiple="props.multiple"
    >
      <option
        class="flex appearance-none space-x-2 rounded-md px-3 py-1.5 text-sm font-medium text-black focus:bg-orange-200 [&:selected]:!bg-gray-200"
        v-for="value in props.values"
        :value="value"
        :selected="props.selectedList?.includes(value)"
      >
        <!-- <IconHeroiconsSolidCheck class="h-5 w-5 [&]" aria-hidden="true" /> -->
        <span> {{ value }}{{ getIndex(value) }} </span>
      </option>
    </select>
  </div>
</template>
