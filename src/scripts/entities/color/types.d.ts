interface Color {
  readonly buttonColors: string
  readonly iconsClasses: string
  readonly hexColor: string
}

type ColorNameVAny = ColorName | ColorNameV1

type ColorName = Exclude<ColorNameV1, 'gray'>

type ColorNameV1 =
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose'
  | 'gray'
