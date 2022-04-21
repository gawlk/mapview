import { blend, getBrowser, colorsClasses } from '/src/scripts'

import CircleIcon from 'iconoir/icons/circle.svg?raw'
import FlareIcon from 'iconoir/icons/flare.svg?raw'
import HeptagonIcon from 'iconoir/icons/heptagon.svg?raw'
import HexagonIcon from 'iconoir/icons/hexagon.svg?raw'
import HexagonAltIcon from 'iconoir/icons/hexagon-alt.svg?raw'
import OctagonIcon from 'iconoir/icons/octagon.svg?raw'
import PentagonIcon from 'iconoir/icons/pentagon.svg?raw'
import RhombusIcon from 'iconoir/icons/rhombus.svg?raw'
import SquareIcon from 'iconoir/icons/square.svg?raw'
import TriangleIcon from 'iconoir/icons/triangle.svg?raw'

export const icons: Record<IconName, string> = {
  circle: CircleIcon,
  triangle: TriangleIcon,
  square: SquareIcon,
  rhombus: RhombusIcon,
  flare: FlareIcon,
  pentagon: PentagonIcon,
  hexagon: HexagonIcon,
  hexagonAlt: HexagonAltIcon,
  heptagon: HeptagonIcon,
  octagon: OctagonIcon,
}

const baseColor = colorsClasses.gray.hexColor

export const createIcon = (iconName: IconName): Icon => {
  const div: HTMLDivElement = document.createElement('div')
  div.classList.add('relative')

  const subDiv = document.createElement('div')
  div.appendChild(subDiv)

  const p = document.createElement('p')
  div.appendChild(p)

  p.classList.add(
    'absolute',
    'inset-0',
    'font-medium',
    'text-white',
    'serif',
    'text-center'
  )
  p.style.left = '-100%'
  p.style.right = '-100%'
  p.style.textShadow = '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'

  const icon = {
    element: div,
    color: baseColor,
    setColor: function (color?: string) {
      const svg = subDiv.firstElementChild as HTMLElement
      this.color = color || this.color
      svg.setAttribute('fill', this.color)
      svg.setAttribute('color', blend(this.color, '#000000'))
    },
    setText: function (text: string) {
      p.innerHTML = text
    },
    setIcon: function (iconName: IconName) {
      subDiv.innerHTML = icons[iconName] || icons.circle
      this.setColor()
    },
  }

  icon.setIcon(iconName)

  return icon
}

export const createSVGElement = (svg: string) => {
  const div = document.createElement('div')
  div.innerHTML = svg
  return div.firstElementChild as HTMLElement
}
