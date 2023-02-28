interface Menu {
  readonly name: string
  readonly icon: any
  readonly component: any
  readonly props: MenuProps
  readonly needsReport?: boolean
  readonly style?: string
  readonly class?: string
  openedOnMobile?: boolean
}

interface MenuProps {
  route: string
}
