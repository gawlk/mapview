interface Icon {
  readonly element: HTMLElement
  readonly color: Accessor<string>
  readonly setColor: (color?: string) => void
  readonly setText: (text: string) => void
  readonly setIcon: (iconName: IconName) => void
}

type IconNameVAny = IconName | IconNameV1

type IconName =
  | 'Circle'
  | 'Triangle'
  | 'Square'
  | 'Rhombus'
  | 'Flare'
  | 'Pentagon'
  | 'Hexagon'
  | 'Heptagon'
  | 'Octagon'

type IconNameV1 =
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
