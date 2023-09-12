import { Details } from '/src/components'

interface Props {
  id: string
  icon: IconProp
  name: string
  class?: string
}

export const baseID = 'desktop-menu-'

export const MenuWrapperDesktop = (props: Props) => {
  return (
    <Details
      button={{
        leftIcon: props.icon,
        text: props.name,
      }}
      defaultOpen
      locked
      class={props.class}
    >
      <div id={`${baseID}${props.id}`} />
    </Details>
  )
}
