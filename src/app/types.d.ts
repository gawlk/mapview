interface Menu {
  readonly name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly icon: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
