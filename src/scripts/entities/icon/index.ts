import CircleIcon from 'iconoir/icons/circle.svg?raw'
import FlareIcon from 'iconoir/icons/flare.svg?raw'
import HeptagonIcon from 'iconoir/icons/heptagon.svg?raw'
import HexagonAltIcon from 'iconoir/icons/hexagon-alt.svg?raw'
import HexagonIcon from 'iconoir/icons/hexagon.svg?raw'
import OctagonIcon from 'iconoir/icons/octagon.svg?raw'
import PentagonIcon from 'iconoir/icons/pentagon.svg?raw'
import RhombusIcon from 'iconoir/icons/rhombus.svg?raw'
import SquareIcon from 'iconoir/icons/square.svg?raw'
import TriangleIcon from 'iconoir/icons/triangle.svg?raw'

import { blend, gray } from '/src/scripts'

export const icons: Record<IconName, string> = {
  Circle: CircleIcon,
  Triangle: TriangleIcon,
  Square: SquareIcon,
  Rhombus: RhombusIcon,
  Flare: FlareIcon,
  Pentagon: PentagonIcon,
  Hexagon: HexagonIcon,
  HexagonAlt: HexagonAltIcon,
  Heptagon: HeptagonIcon,
  Octagon: OctagonIcon,
}

export const createIcon = (iconName: IconName) => {
  if (typeof document === 'undefined') {
    return null
  }

  const div: HTMLDivElement = document.createElement('div')
  // div.classList.add('relative')

  const subDiv = document.createElement('div')
  div.appendChild(subDiv)

  const subDiv2 = document.createElement('div')
  div.appendChild(subDiv2)

  subDiv2.classList.add(
    'absolute',
    'inset-0',
    'flex',
    'items-center',
    'justify-center',
    'h-full'
  )
  subDiv2.style.left = '-100%'
  subDiv2.style.right = '-100%'

  const span = document.createElement('span')
  subDiv2.appendChild(span)

  span.classList.add(
    'font-medium',
    'text-white',
    'serif',
    'mb-0.5',
    'mapview-icon'
  )

  span.style.textShadow = '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'

  const icon = shallowReactive({
    element: div,
    color: gray,
    setColor(color?: string) {
      const svg = subDiv.firstElementChild as HTMLElement
      this.color = color || gray
      svg.setAttribute('fill', this.color)
      svg.setAttribute('color', blend(this.color, '#000000'))
    },
    setText(text: string) {
      span.innerHTML = text
    },
    setIcon(newIconName: IconName) {
      subDiv.innerHTML = icons[newIconName] || icons.Circle
      this.setColor()
    },
  })

  icon.setIcon(iconName)

  return icon
}

export const createSVGElement = (svg: string) => {
  if (document) {
    const div = document.createElement('div')
    div.innerHTML = svg
    return div.firstElementChild as HTMLElement
  }

  return undefined
}
