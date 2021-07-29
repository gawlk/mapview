import { getBrowser } from '../utils/browser'
import { blend } from '../utils/blender'

// import CircleIcon from 'iconoir/icons/circle.svg?raw'

const CircleIcon = `
<svg width="24" height="24" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`

export const icons: {
  [key: string]: string
} = {
  circle: CircleIcon,
}

export const createIcon = (iconName: string = 'circle'): Icon => {
  const div: HTMLDivElement = document.createElement('div')
  div.classList.add('relative')

  div.innerHTML = icons[iconName] || icons.circle

  const icon = div.firstElementChild as HTMLElement
  icon.setAttribute('fill', '#444444')

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

  return {
    element: div,
    setText: (text: string) => {
      p.innerHTML = text
    },
  }
}
