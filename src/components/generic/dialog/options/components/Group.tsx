import { useI18n } from '@solid-primitives/i18n'

import List from './List'

import { Label } from '/src/components'

interface Props {
  input: string | undefined
  selected: string | number | null
  list: GroupedDialogSelectOptionsProps[]
  onClick?: (value?: string) => void
}

export default (props: Props) => {
  const [t] = useI18n()

  return (
    <For each={props.list}>
      {(group) => (
        <Show when={group.list.length}>
          <Label label={t(group.name)}>
            <List {...props} list={group.list} />
          </Label>
        </Show>
      )}
    </For>
  )
}
