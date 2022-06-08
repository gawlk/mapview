interface Menu {
  name: string
  icon: any
  component: any
  props: MenuProps
  needsReport?: boolean
  openedOnMobile?: boolean
}

interface MenuProps {
  route: string
}
