interface Icon {
  element: HTMLElement
  color: string
  setColor: (color?: string) => void
  setText: (text: string) => void
  setIcon: (iconName: IconName) => void
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
