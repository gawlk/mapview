import { useI18n } from '@solid-primitives/i18n'

import { run } from '/src/scripts'

import {
  Button,
  isValuePropSelected,
  valueWithTextToJSXElement,
} from '/src/components'

import { convertDialogValuesPropsListToValuesWithTextProps } from '../scripts'

interface Props {
  input: string | undefined
  selected: string | number | null
  list: ValuesListProps
  onClick?: (value?: string) => void
  showAllWhenEmpty?: boolean
}

export const DialogOptionsList = (props: Props) => {
  const [t] = useI18n()

  const unfilteredList = createMemo(() =>
    convertDialogValuesPropsListToValuesWithTextProps(props.list)
  )

  const list = createMemo(() =>
    unfilteredList().filter(
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
    <Show
      when={
        list().length
          ? list()
          : props.showAllWhenEmpty
          ? unfilteredList()
          : undefined
      }
      fallback={<p>{t('The list is empty')}</p>}
    >
      {(finalList) => (
        <For each={finalList()}>
          {(option, index) => {
            const isSelected = createMemo(() =>
              isValuePropSelected(props.selected, option, index())
            )

            return (
              <Button
                full
                rightIcon={isSelected() ? IconTablerCheck : true}
                {...option}
                onClick={() => props.onClick?.(option.value)}
              >
                <span class="w-full truncate text-left">
                  {run(valueWithTextToJSXElement(option))}
                </span>
              </Button>
            )
          }}
        </For>
      )}
    </Show>
  )
}
