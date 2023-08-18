interface Menu {
  readonly id: string
  readonly name: string
  readonly icon: Exclude<IconProp, true>
  readonly component: Solid.Component
  readonly needsReport?: boolean
  readonly style?: string
  readonly class?: string
  openedOnMobile?: boolean
}
