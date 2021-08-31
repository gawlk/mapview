<template>
  <div>
    <div
      :class="state.dragging ? 'bg-gray-200' : 'bg-gray-100'"
      class="
        relative
        items-center
        justify-center
        w-full
        h-[50vh]
        p-1.5
        cursor-pointer
        rounded-lg
        hover:bg-gray-200
        transition-colors
        duration-200
        group
        hidden
        lg:block
      "
    >
      <div
        :class="state.dragging ? 'border-gray-400' : 'border-gray-300'"
        class="
          w-full
          h-full
          border-[3px] border-dashed
          rounded-lg
          group-hover:border-gray-400
          flex
          items-center
          justify-center
          text-sm
          font-medium font-gray-900
          transition-colors
          duration-200
        "
      >
        <div class="space-y-4">
          <DocumentAddIconOutline
            class="mx-auto text-gray-400 transition-colors duration-200  h-7 group-hover:text-gray-500"
          />
          <p><slot /></p>
        </div>
      </div>

      <div
        @click="$refs.file.click()"
        @dragenter="state.dragging = true"
        @dragleave="state.dragging = false"
        @dragover.prevent
        @drop.stop.prevent="drop?.dataTransfer"
        class="absolute inset-0 w-full h-full"
      />

      <input
        @change="emit('input', $event.target.files)"
        :accept="props.accept"
        type="file"
        ref="file"
        class="hidden"
      />
    </div>
    <Button
      @click="file.click()"
      full
      :leftIcon="DocumentAddIconSolid"
      class="lg:hidden"
    >
      {{ props.buttonText }}
    </Button>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'

  import { DocumentAddIcon as DocumentAddIconSolid } from '@heroicons/vue/solid'
  import { DocumentAddIcon as DocumentAddIconOutline } from '@heroicons/vue/outline'

  import { Button } from '/src/components'

  const emit = defineEmits<{
    (event: 'input', value: FileList): void
  }>()

  const props = defineProps<{
    accept: string
    buttonText: string
  }>()

  const file = ref()

  const state = reactive({
    dragging: false,
  })

  const drop = (dataTransfer: DataTransfer) => {
    state.dragging = false
    if (dataTransfer && dataTransfer.files) {
      emit('input', dataTransfer.files)
    }
  }
</script>
