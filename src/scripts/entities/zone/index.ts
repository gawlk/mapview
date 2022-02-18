const colors: Color[] = [
  'black',
  'white',
  'gray',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
]

export const createZone = (zone?: JSONZone): Zone => {
  return {
    color: zone?.color || colors[Math.floor(Math.random() * colors.length)],
  }
}
