import CircleIcon from 'iconoir/icons/regular/circle.svg?raw'
import FlareIcon from 'iconoir/icons/regular/flare.svg?raw'
import HeptagonIcon from 'iconoir/icons/regular/heptagon.svg?raw'
import HexagonIcon from 'iconoir/icons/regular/hexagon.svg?raw'
import OctagonIcon from 'iconoir/icons/regular/octagon.svg?raw'
import PentagonIcon from 'iconoir/icons/regular/pentagon.svg?raw'
import RhombusIcon from 'iconoir/icons/regular/rhombus.svg?raw'
import SquareIcon from 'iconoir/icons/regular/square.svg?raw'
import TriangleIcon from 'iconoir/icons/regular/triangle.svg?raw'

import { baseHexColor, blend, createASS } from '/src/scripts'

export const icons: Record<IconName, string> = {
  Circle: CircleIcon,
  Triangle: TriangleIcon,
  Square: SquareIcon,
  Rhombus: RhombusIcon,
  Flare: FlareIcon,
  Pentagon: PentagonIcon,
  Hexagon: HexagonIcon,
  Heptagon: HeptagonIcon,
  Octagon: OctagonIcon,
}

export const createIcon = (iconName: IconName) => {
  if (typeof document === 'undefined') {
    return null
  }

  const div: HTMLDivElement = document.createElement('div')

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
    'h-full',
  )
  subDiv2.style.left = '-50%'
  subDiv2.style.right = '-50%'

  const span = document.createElement('span')
  subDiv2.appendChild(span)

  span.classList.add(
    'font-medium',
    'text-white',
    'serif',
    'mb-0.5',
    'mapview-icon',
  )

  span.style.textShadow = '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'

  const color = createASS(baseHexColor)

  const icon: Icon = {
    element: div,
    color,
    setColor(_color?: string) {
      _color && color.set(_color)

      const svg = subDiv.firstElementChild as HTMLElement
      svg.setAttribute('fill', this.color())
      svg.setAttribute('color', blend(this.color(), '#000000'))
    },
    setText(text: string) {
      span.innerHTML = text
    },
    setIcon(newIconName: IconName) {
      subDiv.innerHTML = icons[newIconName] || icons.Circle
      this.setColor()
    },
  }

  icon.setIcon(iconName)

  return icon
}

export const createSVGElement = (svg: string) => {
  if (!document) return undefined

  const div = document.createElement('div')
  div.innerHTML = svg

  return div.firstElementChild as HTMLElement
}

export const formatIconSVGForUI = (svg: string) =>
  svg
    .replace('width="24"', 'stroke="currentColor"')
    .replace('height="24"', '')
    .replace('stroke-width="1.5"', 'stroke-width="2"')
