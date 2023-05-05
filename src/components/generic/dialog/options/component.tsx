import { isListOfGroups } from './scripts'

import Group from './components/Group'
import List from './components/List'

interface Props {
  input?: string
  options: DialogSelectOptionsProps
  onClick?: (value?: string) => void
}

export default (props: Props) => {
  return (
    <Show
      when={isListOfGroups(props.options)}
      fallback={
        <List
          input={props.input}
          selected={props.options.selected}
          list={props.options.list as string[] | DialogSelectOptionProps[]}
          onClick={props.onClick}
        />
      }
    >
      <Group
        input={props.input}
        selected={props.options.selected}
        list={props.options.list as GroupedDialogSelectOptionsProps[]}
        onClick={props.onClick}
      />
    </Show>
  )
}
