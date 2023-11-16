import { Details } from '/src/components'

interface Props {
  readonly id: string
  readonly icon: IconProp
  readonly name: string
  readonly class?: string
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
