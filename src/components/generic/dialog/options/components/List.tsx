import { useI18n } from '@solid-primitives/i18n'

import { Button } from '/src/components'

import { convertListToOptions, optionToJSXElement } from '../scripts'

interface Props {
  input: string | undefined
  selected: string | number | null
  list: string[] | DialogSelectOptionProps[]
  onClick?: (value?: string) => void
}

export default (props: Props) => {
  const [t] = useI18n()

  const list = createMemo(() =>
    convertListToOptions(props.list).filter(
      (option) =>
        !props.input ||
        (option.text
          ? typeof option.text === 'function'
            ? // @ts-ignore
              option.text()?.textContent
            : option.text
          : option.value
        )
          .toLowerCase()
          .includes(props.input.toLowerCase())
    )
  )

  return (
    <Show when={list().length} fallback={<p>{t('The list is empty')}</p>}>
      <For each={list()}>
        {(option, index) => {
          const isSelected = createMemo(
            () =>
              (typeof props.selected === 'number' &&
                index() === props.selected) ||
              props.selected === option.value ||
              props.selected === option.text
          )

          return (
            <Button
              full
              rightIcon={isSelected() ? IconTablerCheck : true}
              {...option}
              onClick={() => props.onClick?.(option.value)}
            >
              <span class="w-full truncate text-left">
                {optionToJSXElement(option)()}
              </span>
            </Button>
          )
        }}
      </For>
    </Show>
  )
}
