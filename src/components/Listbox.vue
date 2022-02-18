<script setup lang="ts">
  import {
    Listbox as HeadlessListbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  } from '@headlessui/vue'

  const emit = defineEmits<{
    (event: 'select', value: string): void
    (event: 'selectIndex', value: number): void
  }>()

  const props = defineProps<{
    values?: string[]
    selected?: string | number
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
  }>()

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
      <ListboxButton
        :style="{ backgroundImage: `url('${props.buttonBackground}')` }"
        :class="[
          props.buttonBackground && 'bg-cover bg-center',
          props.buttonColors || 'bg-gray-100 hover:bg-gray-200',
        ]"
        class="group flex w-full items-center justify-between space-x-4 truncate rounded-lg py-2 px-4 text-sm font-medium leading-6 transition-colors duration-200 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300"
      >
        <div class="flex items-center">
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
          <span
            v-if="props.preSelected"
            class="ml-1 hidden text-gray-500 sm:block"
          >
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
          class="absolute bottom-0 z-10 mb-11 max-h-60 w-full space-y-1 overflow-auto rounded-lg border-2 border-gray-100 bg-white p-1 text-sm shadow-md focus:outline-none lg:bottom-auto lg:mt-1 lg:mb-0 lg:shadow-lg"
        >
          <ListboxOption
            v-slot="{ active, selected }"
            v-for="value in props.values || props.classes || props.backgrounds"
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
              ]"
              class="relative h-9 cursor-default select-none py-2 pr-4 pl-10"
            >
              <span
                v-if="props.values"
                :class="[selected ? 'font-medium' : 'font-normal']"
                class="truncaten block"
                v-html="value"
              />
              <span
                v-if="selected"
                class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600"
              >
                <IconHeroiconsSolidCheck class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </TransitionDropdown>
    </div>
  </HeadlessListbox>
</template>
