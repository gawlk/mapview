interface Menu {
  name: string
  icon: any
  component: any
  props: MenuProps
  needsReport?: boolean
  openedOnMobile?: boolean
  style?: string
  class?: string
}

interface MenuProps {
  route: string
}
