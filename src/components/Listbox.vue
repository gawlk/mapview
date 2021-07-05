<template>
  <Listbox :modelValue="props.selected" @update:modelValue="update">
    <div :class="[props.full && 'w-full']" class="relative">
      <ListboxButton
        :style="{ backgroundImage: `url('${props.buttonBackground}')` }"
        :class="[
          props.buttonBackground && 'bg-cover bg-center',
          props.buttonColors || 'bg-gray-100 hover:bg-gray-200',
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
          rounded-lg
          leading-6
          font-medium
          group
          transition-colors
          duration-200
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
              props.buttonBackground
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
            {{
              props.selectedReplacement ||
              (props.values.includes(props.selected)
                ? props.selected
                : props.values[0])
            }}
          </span>
        </div>
        <div>
          <SelectorIcon
            :class="[
              props.iconsClasses,
              props.buttonBackground
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
          :class="[props.listTop ? 'bottom-0 mb-11' : 'mt-1 shadow-lg']"
          class="
            absolute
            w-full
            py-1
            mt-1
            overflow-auto
            text-base
            bg-white
            rounded-md
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
  import { defineEmit, defineProps, ref } from 'vue'
  import {
    Listbox,
    ListboxLabel,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  } from '@headlessui/vue'
  import { CheckIcon, SelectorIcon } from '@heroicons/vue/solid'

  const emit = defineEmit(['select', 'selectIndex'])

  const props = defineProps({
    icon: Function,
    values: Array,
    preSelected: String,
    selected: String | Number,
    selectedReplacement: String,
    full: Boolean,
    backgrounds: Array,
    classes: Array,
    buttonBackground: String,
    buttonColors: String,
    iconsClasses: String,
    listTop: Boolean,
  })

  const update = (value) => {
    emit('select', value)
    emit('selectIndex', props.values.indexOf(value))
  }
</script>
