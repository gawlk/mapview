<script setup lang="ts">
  import {
    Listbox as HeadlessListbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  } from '@headlessui/vue'

  import TransitionDropdown from './TransitionDropdown.vue'

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
    backgrounds?: string[]
    classes?: string[]
    buttonBackground?: string
    buttonColors?: string
    iconsClasses?: string
    postSelected?: string
    sm?: boolean
  }>()

  let options = ref()

  const update = (value: string) => {
    emit('select', value)

    const list = props.values || props.backgrounds || props.classes

    list && emit('selectIndex', list.indexOf(value))
  }
</script>

<template>
  <HeadlessListbox
    :modelValue="
      props.selected !== undefined
        ? props.selected
        : (props.values || props.backgrounds || props.classes)?.[
            props.selectedIndex || 0
          ]
    "
    @update:modelValue="update"
  >
    <div :class="[props.full && 'w-full']" class="relative">
      <div>
        <ListboxButton
          :style="{ backgroundImage: `url('${props.buttonBackground}')` }"
          :class="[
            props.sm
              ? 'space-x-1 rounded-md py-0.5 px-1.5 text-sm'
              : 'space-x-3 rounded-lg py-2 px-4',
            props.buttonBackground && 'bg-cover bg-center',
            props.buttonColors || 'bg-gray-100 hover:bg-gray-200',
          ]"
          class="group flex h-full w-full items-center justify-between truncate text-sm font-medium leading-6 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300"
        >
          <div class="flex items-center truncate">
            <component
              v-if="props.icon"
              :is="props.icon"
              :class="[
                props.iconsClasses || 'text-gray-400 group-hover:text-gray-500',
                props.buttonBackground
                  ? '-my-0.5 -ml-1 h-7 w-7 rounded-full bg-gray-100 bg-opacity-60 p-1'
                  : 'h-5 w-5',
              ]"
              class="mr-1 flex-none transition-colors duration-200"
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
                props.buttonBackground
                  ? '-my-0.5 -mr-1 h-7 w-7 rounded-full bg-gray-100 bg-opacity-60 p-1'
                  : 'h-5 w-5',
              ]"
              class="transition-colors duration-200"
              aria-hidden="true"
            />
          </div>
        </ListboxButton>

        <TransitionDropdown>
          <ListboxOptions
            :ref="options"
            :class="
              props.sm ? 'rounded-md border p-0.5' : 'rounded-lg border-2 p-1'
            "
            class="absolute bottom-0 z-20 mb-11 max-h-60 w-full space-y-1 overflow-auto border-gray-100 bg-white text-left text-sm shadow-md focus:outline-none lg:bottom-auto lg:mt-1 lg:mb-0 lg:shadow-lg"
          >
            <ListboxOption
              v-slot="{ active, selected }"
              v-for="value in props.values ||
              props.classes ||
              props.backgrounds"
              :key="value"
              :value="value"
              as="template"
              class="cursor-pointer rounded-md"
            >
              <li
                :style="{
                  backgroundImage: props.backgrounds ? `url('${value}')` : '',
                }"
                :class="[
                  active && !props.classes
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-900',
                  props.backgrounds && 'bg-cover bg-center',
                  props.classes && value,
                  props.sm ? 'h-7 py-1 pl-7' : 'h-9 py-2 pl-10',
                ]"
                class="relative cursor-default select-none"
              >
                <span
                  v-if="props.values"
                  :class="[selected ? 'font-medium' : 'font-normal']"
                  class="block truncate"
                  v-html="value"
                />
                <span
                  v-if="selected"
                  :class="props.sm ? 'pl-1' : 'pl-3'"
                  class="absolute inset-y-0 left-0 flex items-center text-gray-600"
                >
                  <IconHeroiconsSolidCheck class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </TransitionDropdown>
      </div>
    </div>
  </HeadlessListbox>
</template>
