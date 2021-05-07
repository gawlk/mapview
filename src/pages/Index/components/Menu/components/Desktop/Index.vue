<template>
    <div class="flex-none w-[400px] p-4">
        <Button full centered @click="inputFile.click()">Add image</Button>
        <input
            @change="addImageToMap($event.target.files[0])"
            accept="image/*"
            type="file"
            ref="inputFile"
            class="hidden"
        />
    </div>
</template>

<script setup>
    import store from '/src/store'
    import { createImageMap } from '/src/scripts/project/imageMap'

    import { Button } from '/src/components'

    ref: inputFile

    const addImageToMap = (image) => {
        if (image) {
            createImageMap(store.map, image, 'test')
        }
    }
</script>
