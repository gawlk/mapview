<script setup lang="ts">
  import Button from '/src/components/Button.vue'
  import Divider from '/src/components/Divider.vue'

  import IconChevronRight from '~icons/heroicons-solid/chevron-right'
  import IconChevronLeft from '~icons/heroicons-solid/chevron-left'

  const { t } = useI18n()

  let div = ref()

  const props = defineProps<{
    readonly buttonIcon: any
    readonly buttonText: string
    readonly route: string
    readonly menuProps: MenuProps
  }>()

  const state = shallowReactive({
    submenuActive: false,
    oldMenuRoute: '',
  })

  const setDisplayToParentsChildren = (display: string) => {
    Array.from(
      (div.value as HTMLDivElement).parentElement?.children as any
    ).forEach((node) => {
      if (node !== div.value) {
        ;(node as unknown as HTMLElement).style.display = display
      }
    })
  }

  const openSubmenu = () => {
    setDisplayToParentsChildren('none')
    state.submenuActive = true
    state.oldMenuRoute = props.menuProps.route
    props.menuProps.route = props.route
  }

  const closeSubmenu = () => {
    setDisplayToParentsChildren('')
    state.submenuActive = false
    props.menuProps.route = state.oldMenuRoute
  }

  onMounted(() => {
    props.menuProps?.route === props.route && openSubmenu()
  })
</script>

<template>
  <Button
    :leftIcon="props.buttonIcon"
    :rightIcon="IconChevronRight"
    @click="openSubmenu"
    full
  >
    {{ props.buttonText }}
  </Button>
  <div
    ref="div"
    :class="[state.submenuActive ? '!mt-0' : 'hidden', 'space-y-2']"
  >
    <slot />
    <Divider />
    <Button full @click="closeSubmenu" :leftIcon="IconChevronLeft">
      {{ t('Back') }}
    </Button>
  </div>
</template>
