import {
  Button,
  isValuePropSelected,
  valueWithTextToJSXElement,
} from '/src/components'
import { useAppState } from '/src/index'
import { run } from '/src/scripts'

import { convertDialogValuesPropsListToValuesWithTextProps } from '../scripts'

interface Props {
  readonly input: string | undefined
  readonly selected: string | number | null
  readonly list: ValuesListProps
  readonly onClick?: (value?: string) => void
  readonly showAllWhenEmpty?: boolean
}

export const DialogOptionsList = (props: Props) => {
  const { t } = useAppState()

  const unfilteredList = createMemo(() =>
    convertDialogValuesPropsListToValuesWithTextProps(props.list),
  )

  const list = createMemo(() =>
    unfilteredList().filter((option) => {
      if (!props.input) return true

      let value

      if (option.text) {
        value =
          typeof option.text === 'function'
            ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              option.text()?.textContent
            : option.text
      } else {
        value = option.value
      }

      return value.toLowerCase().includes(props.input.toLowerCase())
    }),
  )

  const _finalList = createMemo(() => {
    if (list().length) return list()
    if (props.showAllWhenEmpty) return unfilteredList()
    return undefined
  })

  return (
    <Show when={_finalList()} fallback={<p>{t('The list is empty')}</p>}>
      {(finalList) => (
        <For each={finalList()}>
          {(option, index) => {
            const isSelected = createMemo(() =>
              isValuePropSelected(props.selected, option, index()),
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
