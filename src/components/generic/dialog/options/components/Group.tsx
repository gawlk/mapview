import { Label } from '/src/components'
import { useAppState } from '/src/index'

import { DialogOptionsList } from './List'

interface Props {
  input: string | undefined
  selected: string | number | null
  list: GroupedDialogSelectOptionsProps[]
  onClick?: (value?: string) => void
  showAllWhenEmpty?: boolean
}

export const DialogOptionsGroup = (props: Props) => {
  const { t } = useAppState()

  return (
    <For each={props.list}>
      {(group) => (
        <Show when={group.list.length}>
          <Label label={t(group.name)}>
            <DialogOptionsList {...props} list={group.list} />
          </Label>
        </Show>
      )}
    </For>
  )
}
