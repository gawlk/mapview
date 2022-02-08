interface Icon {
  element: HTMLElement
  color: string
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
