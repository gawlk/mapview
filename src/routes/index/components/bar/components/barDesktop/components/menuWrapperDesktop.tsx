import { getDisclosureOpenState, setDisclosureOpenState } from '/src/scripts'

import { Details } from '/src/components'

interface Props extends Solid.ParentProps {
  icon: IconProp
  name: string
  menuProps: MenuProps
}

export default (props: Props) => {
  const key = createMemo(() => `isDesktopMenu${props.name}Open`)

  return (
    <Details
      icon={props.icon}
      text={props.name + props.menuProps.route}
      defaultOpen={getDisclosureOpenState(key())}
      onClick={(open) => setDisclosureOpenState(key(), open)}
    >
      {props.children}
    </Details>
  )
}
