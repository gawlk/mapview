<script setup lang="ts">
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
  }>()

  const update = (value: string) => {
    emit('select', value)

    const list = props.values || props.classes

    list && emit('selectIndex', list.indexOf(value))
  }
</script>

<template>
  <div
    :class="[props.full && 'w-full']"
    class="group relative flex h-full w-full items-center justify-between space-x-1 truncate rounded-md bg-gray-100 py-0.5 px-1.5 text-sm font-medium leading-6 transition-colors duration-200 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300"
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
      @change="(event) => update((event.target as HTMLSelectElement).value)"
      class="absolute inset-0 z-10 w-full cursor-pointer appearance-none bg-transparent text-transparent focus:outline-none disabled:cursor-default"
    >
      <option
        v-for="value in props.values"
        :value="value"
        class="text-black"
        :selected="props.selected === value"
      >
        {{ value }}
      </option>
    </select>
  </div>
</template>
