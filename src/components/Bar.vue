<template>
    <div
        class="max-w-6xl mx-auto pt-4 sm:px-16 sm:pt-8 flex flex-col sm:flex-row justify-center sm:justify-between items-center space-y-2 sm:space-y-0"
    >
        <Link href="/">
            <Logo class="h-6 sm:h-8 w-auto" />
        </Link>
        <div class="space-x-2">
            <Button lg transparent href="/"> Link 1 </Button>
            <Button lg transparent href="/"> Link 2 </Button>
            <Button lg transparent href="/"> Link 3 </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import Button from './Button.vue'
    import Link from './Link.vue'

    import Logo from '/src/assets/svg/syp/logo.svg'
</script>
