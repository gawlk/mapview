import { useI18n } from '@solid-primitives/i18n'

import { DialogOptionsList } from './List'

import { Label } from '/src/components'

interface Props {
  input: string | undefined
  selected: string | number | null
  list: GroupedDialogSelectOptionsProps[]
  onClick?: (value?: string) => void
  showAllWhenEmpty?: boolean
}

export const DialogOptionsGroup = (props: Props) => {
  const [t] = useI18n()

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
