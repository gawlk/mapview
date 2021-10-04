type MenuProp = {
  name: string
  icon: () => void
  component: any
  needsReport?: boolean
  openedOnMobile?: boolean
}
