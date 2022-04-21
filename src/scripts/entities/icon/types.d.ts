interface Icon {
  element: HTMLElement
  color: string
  setColor: (color?: string) => void
  setText: (text: string) => void
  setIcon: (iconName: IconName) => void
}

type IconName =
  | 'circle'
  | 'triangle'
  | 'square'
  | 'rhombus'
  | 'flare'
  | 'pentagon'
  | 'hexagon'
  | 'hexagonAlt'
  | 'heptagon'
  | 'octagon'
