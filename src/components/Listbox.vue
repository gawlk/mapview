<template>
    <Listbox
        as="div"
        :modelValue="props.selected"
        @update:modelValue="update"
        :class="[
            props.xxl
                ? 'text-2xl'
                : props.xl
                ? 'text-xl'
                : props.lg
                ? 'text-lg'
                : 'text-base',
        ]"
        class="space-y-1 leading-6 relative"
    >
        <ListboxLabel
            v-if="props.label"
            :class="[
                props.centered && 'text-center',
                props.xxl
                    ? 'text-xl mb-2'
                    : props.xl
                    ? 'text-lg mb-1.5'
                    : props.lg
                    ? 'text-base mb-1'
                    : 'text-sm mb-0.5',
            ]"
            class="block opacity-75 font-medium ml-4"
        >
            {{ props.label }}
        </ListboxLabel>
        <ListboxButton
            :class="[
                props.xxl
                    ? 'py-5 px-10 rounded-2xl border-4'
                    : props.xl
                    ? 'py-3 px-6 rounded-xl border-4'
                    : props.lg
                    ? 'py-2 px-5 rounded-xl border-4'
                    : 'py-1.5 px-4 rounded-lg border-2',
            ]"
            class="w-full border-gray-100 text-left font-medium focus:ring focus:ring-gray-50"
        >
            {{ props.selected }}
        </ListboxButton>
        <ListboxOptions
            :class="[
                props.xxl
                    ? 'py-5 px-10 rounded-2xl border-4'
                    : props.xl
                    ? 'py-3 px-6 rounded-xl border-4'
                    : props.lg
                    ? 'py-2 px-5 rounded-xl border-4'
                    : 'py-1.5 px-4 rounded-lg border-2',
            ]"
            class="z-40 absolute shadow w-full border-gray-100 bg-white space-y-2"
        >
            <ListboxOption
                v-for="element in props.list"
                :key="element"
                :value="element"
                class="font-normal cursor-pointer"
            >
                {{ element }}
            </ListboxOption>
        </ListboxOptions>
    </Listbox>
</template>

<script setup lang="ts">
    import { defineEmit, defineProps } from 'vue'
    import {
        Listbox,
        ListboxLabel,
        ListboxButton,
        ListboxOptions,
        ListboxOption,
    } from '@headlessui/vue'

    const emit = defineEmit()

    const props = defineProps({
        label: String,
        selected: String,
        centered: Boolean,
        list: Array,
        lg: Boolean,
        xl: Boolean,
        xxl: Boolean,
    })

    const update = (value) => {
        emit('select', value)
        emit('selectIndex', props.list.indexOf(value))
    }
</script>
