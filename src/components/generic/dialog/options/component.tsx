import { isListOfGroups } from './scripts'

import Group from './components/Group'
import List from './components/List'

interface Props {
  input?: string
  options: DialogValuesProps
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
          list={props.options.list as ValuesListProps}
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
