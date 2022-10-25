<script setup lang="ts">
  import IconSolidDocumentAdd from '~icons/heroicons-solid/document-add'

  import Button from './Button.vue'

  const emit = defineEmits<{
    (event: 'input', value: FileList | null): void
  }>()

  const props = defineProps<{
    readonly accept: string
    readonly buttonText: string
  }>()

  const file = ref()

  const state = reactive({
    dragging: false,
  })

  const drop = (dataTransfer: DataTransfer | null) => {
    state.dragging = false

    if (dataTransfer && dataTransfer.files) {
      emit('input', dataTransfer.files)
    }
  }
</script>

<template>
  <div>
    <div
      :class="state.dragging ? 'bg-gray-200' : 'bg-gray-100'"
      class="group relative hidden h-[55vh] w-full cursor-pointer items-center justify-center rounded-lg p-1.5 transition-colors duration-200 hover:bg-gray-200 lg:block"
    >
      <div
        :class="state.dragging ? 'border-gray-400' : 'border-gray-300'"
        class="font-gray-900 flex h-full w-full items-center justify-center rounded-lg border-[3px] border-dashed text-sm font-medium transition-colors duration-200 group-hover:border-gray-400"
      >
        <div class="space-y-4">
          <IconHeroiconsOutlineDocumentAdd
            class="mx-auto h-7 w-7 text-gray-400 transition-colors duration-200 group-hover:text-gray-500"
          />
          <p><slot /></p>
        </div>
      </div>

      <div
        @click="file.click()"
        @dragenter="state.dragging = true"
        @dragleave="state.dragging = false"
        @dragover.prevent
        @drop.stop.prevent="drop($event.dataTransfer)"
        class="absolute inset-0 h-full w-full"
      />

      <input
        @change="emit('input', ($event.target as HTMLInputElement).files)"
        :accept="props.accept"
        type="file"
        ref="file"
        class="hidden"
      />
    </div>
    <Button
      @click="file.click()"
      full
      :leftIcon="IconSolidDocumentAdd"
      class="lg:hidden"
    >
      {{ props.buttonText }}
    </Button>
  </div>
</template>
