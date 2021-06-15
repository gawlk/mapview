<template>
  <Listbox v-model="props.selected">
    <div :class="[props.full && 'w-full']" class="relative">
      <ListboxButton
        :style="{ backgroundImage: `url('${props.selectedBackground}')` }"
        :class="[
          props.selectedBackground && 'bg-cover bg-center',
          props.selectedClasses,
        ]"
        class="
          w-full
          flex
          justify-between
          items-center
          space-x-4
          px-4
          py-2
          text-sm
          bg-gray-100
          rounded-lg
          leading-6
          font-medium
          group
          transition-colors
          duration-200
          hover:bg-gray-200
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-opacity-75
          focus-visible:ring-white
          focus-visible:ring-offset-orange-300
          focus-visible:ring-offset-2
          focus-visible:border-indigo-500
        "
      >
        <div class="flex items-center">
          <component
            v-if="props.icon"
            :is="props.icon"
            :class="[
              props.iconsClasses,
              props.selectedBackground
                ? 'bg-gray-100 bg-opacity-60 rounded-full p-1 h-7 w-7 -my-0.5 -ml-1'
                : 'w-5 h-5',
            ]"
            class="
              text-gray-400
              group-hover:text-gray-500
              mr-1
              transition-colors
              duration-200
            "
          />
          <span v-if="props.preSelected" class="ml-1 truncate text-gray-500">
            {{ props.preSelected }}
          </span>
          <span
            v-if="props.selectedReplacement || props.values"
            class="ml-1 truncate"
          >
            {{ props.selectedReplacement || selected }}
          </span>
        </div>
        <div>
          <SelectorIcon
            :class="[
              props.iconsClasses,
              props.selectedBackground
                ? 'bg-gray-100 bg-opacity-60 rounded-full p-1 h-7 w-7 -my-0.5 -mr-1'
                : 'w-5 h-5',
            ]"
            class="
              text-gray-400
              group-hover:text-gray-500
              transition-colors
              duration-200
            "
            aria-hidden="true"
          />
        </div>
      </ListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="
            absolute
            w-full
            py-1
            mt-1
            overflow-auto
            text-base
            bg-white
            rounded-md
            shadow-lg
            max-h-60
            ring-1 ring-black ring-opacity-5
            focus:outline-none
            sm:text-sm
            z-10
          "
        >
          <ListboxOption
            v-slot="{ active, selected }"
            v-for="value in props.values || props.classes || props.backgrounds"
            :key="value"
            :value="value"
            as="template"
          >
            <li
              :style="{
                backgroundImage: props.backgrounds ? `url('${value}')` : '',
              }"
              :class="[
                active ? 'text-gray-900 bg-gray-100' : 'text-gray-900',
                props.backgrounds && 'bg-cover bg-center',
                props.classes && value,
              ]"
              class="cursor-default select-none relative py-2 pl-10 pr-4 h-9"
            >
              <span
                v-if="props.values"
                :class="[selected ? 'font-medium' : 'font-normal']"
                class="block truncaten"
              >
                {{ value }}
              </span>
              <span
                v-if="selected"
                class="
                  absolute
                  inset-y-0
                  left-0
                  flex
                  items-center
                  pl-3
                  text-gray-600
                "
              >
                <CheckIcon class="w-5 h-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup lang="ts">
  import { defineProps, ref } from 'vue'
  import {
    Listbox,
    ListboxLabel,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  } from '@headlessui/vue'
  import { CheckIcon, SelectorIcon } from '@heroicons/vue/solid'

  const props = defineProps({
    icon: Function,
    values: Array,
    preSelected: String,
    selected: String,
    selectedReplacement: String,
    full: Boolean,
    backgrounds: Array,
    classes: Array,
    selectedBackground: String,
    selectedClasses: String,
    iconsClasses: String,
  })
</script>
