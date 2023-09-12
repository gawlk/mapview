interface Icon {
  readonly element: HTMLElement
  readonly color: string
  readonly setColor: (color?: string) => void
  readonly setText: (text: string) => void
  readonly setIcon: (iconName: IconName) => void
}

type IconName =
  | 'Circle'
  | 'Triangle'
  | 'Square'
  | 'Rhombus'
  | 'Flare'
  | 'Pentagon'
  | 'Hexagon'
  | 'HexagonAlt'
  | 'Heptagon'
  | 'Octagon'
