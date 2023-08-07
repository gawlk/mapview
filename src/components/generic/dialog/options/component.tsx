import { isListOfGroups } from './scripts'

import { DialogOptionsGroup } from './components/Group'
import { DialogOptionsList } from './components/List'

interface Props {
  input?: string
  options: DialogValuesProps
  onClick?: (value?: string) => void
  showAllWhenEmpty?: boolean
}

export const DialogOptions = (props: Props) => {
  return (
    <Show
      when={isListOfGroups(props.options)}
      fallback={
        <DialogOptionsList
          input={props.input}
          selected={props.options.selected}
          list={props.options.list as ValuesListProps}
          onClick={props.onClick}
          showAllWhenEmpty={props.showAllWhenEmpty}
        />
      }
    >
      <DialogOptionsGroup
        input={props.input}
        selected={props.options.selected}
        list={props.options.list as GroupedDialogSelectOptionsProps[]}
        onClick={props.onClick}
        showAllWhenEmpty={props.showAllWhenEmpty}
      />
    </Show>
  )
}
