import { Label } from '/src/components'
import { useAppState } from '/src/index'

import { DialogOptionsList } from './List'

interface Props {
  readonly input: string | undefined
  readonly selected: string | number | null
  readonly list: GroupedDialogSelectOptionsProps[]
  readonly onClick?: (value?: string) => void
  readonly showAllWhenEmpty?: boolean
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
