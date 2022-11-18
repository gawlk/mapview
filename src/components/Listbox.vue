<script setup lang="ts">
  import {
    Listbox as HeadlessListbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
  } from '@headlessui/vue'

  import TransitionDropdown from './TransitionDropdown.vue'

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
    readonly hidePreSelectedOnMobile?: true
    readonly selectedReplacement?: string
    readonly full?: boolean
    readonly backgrounds?: string[]
    readonly classes?: string[]
    readonly buttonBackground?: string
    readonly buttonColors?: string
    readonly iconsClasses?: string
    readonly postSelected?: string
    readonly sm?: boolean
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
    <div class="relative" :class="[props.full && 'w-full min-w-0']">
      <ListboxButton
        class="group flex h-full w-full items-center justify-between truncate text-sm font-medium leading-6 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300"
        :style="{ backgroundImage: `url('${props.buttonBackground}')` }"
        :class="[
          props.sm
            ? 'space-x-1 rounded-md py-0.5 px-1.5 text-sm'
            : 'space-x-3 rounded-lg py-2 px-4',
          props.buttonBackground && 'bg-cover bg-center',
          props.buttonColors || 'bg-gray-100 hover:bg-gray-200',
        ]"
      >
        <div class="flex items-center truncate">
          <component
            class="mr-1 flex-none transition-colors duration-200"
            v-if="props.icon"
            :is="props.icon"
            :class="[
              props.iconsClasses || 'text-gray-400 group-hover:text-gray-500',
              props.buttonBackground
                ? '-my-0.5 -ml-1 h-7 w-7 rounded-full bg-gray-100 bg-opacity-60 p-1'
                : 'h-5 w-5',
            ]"
          />
          <span
            class="ml-1 text-gray-500"
            v-if="!props.hidePreSelectedOnMobile && props.preSelected"
          >
            {{ props.preSelected }}
          </span>
          <span
            class="ml-1 truncate"
            v-if="props.selectedReplacement || props.values"
            v-html="
              props.selectedReplacement ||
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
            class="transition-colors duration-200"
            :class="[
              props.iconsClasses || 'text-gray-400 group-hover:text-gray-500',
              props.buttonBackground
                ? '-my-0.5 -mr-1 h-7 w-7 rounded-full bg-gray-100 bg-opacity-60 p-1'
                : 'h-5 w-5',
            ]"
            aria-hidden="true"
          />
        </div>
      </ListboxButton>

      <TransitionDropdown>
        <ListboxOptions
          class="absolute bottom-0 z-20 mb-11 max-h-60 w-full space-y-1 overflow-auto border-gray-100 bg-white text-left text-sm shadow-md focus:outline-none lg:bottom-auto lg:mt-1 lg:mb-0 lg:shadow-lg"
          :class="
            props.sm ? 'rounded-md border p-0.5' : 'rounded-lg border-2 p-1'
          "
        >
          <ListboxOption
            class="cursor-pointer rounded-md"
            v-slot="{ active, selected }"
            v-for="value in props.values || props.classes || props.backgrounds"
            :key="value"
            :value="value"
            as="template"
          >
            <li
              class="relative cursor-default select-none"
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
            >
              <span
                class="block truncate"
                v-if="props.values"
                v-html="value"
                :class="[selected ? 'font-medium' : 'font-normal']"
              />
              <span
                class="absolute inset-y-0 left-0 flex items-center text-gray-600"
                v-if="selected"
                :class="props.sm ? 'pl-1' : 'pl-3'"
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
