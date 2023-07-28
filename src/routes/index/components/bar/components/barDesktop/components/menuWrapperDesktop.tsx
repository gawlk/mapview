import { Details } from '/src/components'

interface Props {
  id: string
  icon: IconProp
  name: string
}

export const baseID = 'desktop-menu-'

export default (props: Props) => {
  return (
    <Details
      button={{
        leftIcon: props.icon,
        text: props.name,
      }}
      defaultOpen
      locked
    >
      <div id={`${baseID}${props.id}`} />
    </Details>
  )
}
