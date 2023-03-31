import { addLocationToID, localStorageSetItem } from '/src/scripts'

import { Button, Dialog, Input, classPropToString } from '/src/components'

export interface Props
  extends MergePropsWithHTMLProps<
    DialogSelectProps,
    Solid.JSX.DialogHTMLAttributes
  > {}

const optionToJSXElement = (
  option: DialogSelectOptionProps
): (() => Solid.JSX.Element) =>
  typeof option.text === 'function'
    ? option.text
    : () => String(option.text ?? option.value ?? '')

const convertListToOptions = (
  list: DialogSelectProps['options']['list']
): DialogSelectOptionProps[] => {
  const first = list.at(0)

  if (first) {
    if (typeof first !== 'string') {
      if ('list' in first) {
        return (list as (typeof first)[]).map((group) => group.list).flat()
      } else {
        return list as (typeof first)[]
      }
    } else {
      return list.map((value) => ({
        value: value as typeof first,
      }))
    }
  } else {
    return []
  }
}

export default (props: Props) => {
  const [state, setState] = createStore({
    input: undefined as string | undefined,
  })

  let id: string | undefined

  if (props.id) {
    id = addLocationToID(props.id)

    if (props.saveable) {
      const saved = localStorage.getItem(id)

      saved && props.onClose?.(saved)
    }
  }

  const isRelative = createMemo(() => props.position === 'relative')

  const getDialogButtonText = () => {
    const option =
      typeof props.options.selected === 'number'
        ? convertListToOptions(props.options.list).at(props.options.selected)
        : convertListToOptions(props.options.list).find(
            (option) =>
              option.value === props.options.selected ||
              option.text === props.options.selected
          )

    return option ? optionToJSXElement(option) : undefined
  }

  return (
    <Dialog
      // TODO: Clean props before spreading
      {...props}
      button={mergeProps(
        {
          id,
          role: 'listbox' as const,
          rightIcon: IconTablerSelector,
          text: getDialogButtonText(),
        } as DialogButtonProps,
        props.button
      )}
      onClose={(value?: string) => {
        if (props.saveable) {
          localStorageSetItem(id, value)
        }

        props.onClose?.(value)
      }}
      sticky={
        props.search ? (
          <div class={classPropToString([isRelative() ? 'px-2 pt-2' : 'px-4'])}>
            <Input
              {...props.search}
              leftIcon={IconTablerListSearch}
              label="Name"
              full
              class={['flex-none', props.search?.class]}
              onInput={(value?: string) => setState('input', value)}
            />
          </div>
        ) : undefined
      }
      form={
        <div
          class={classPropToString([
            isRelative() ? 'space-y-1.5' : 'space-y-2',
          ])}
        >
          {(() => {
            const list = createMemo(() =>
              convertListToOptions(props.options.list).filter(
                (option) =>
                  !state.input ||
                  (option.text
                    ? typeof option.text === 'function'
                      ? // @ts-ignore
                        option.text()?.textContent
                      : option.text
                    : option.value
                  )
                    .toLowerCase()
                    .includes(state.input.toLowerCase())
              )
            )

            return (
              <Show when={list().length} fallback="The list is empty.">
                <For each={list()}>
                  {(option, index) => {
                    const isSelected = createMemo(
                      () =>
                        (typeof props.options.selected === 'number' &&
                          index() === props.options.selected) ||
                        props.options.selected === option.value ||
                        props.options.selected === option.text
                    )

                    return (
                      <Button
                        full
                        rightIcon={isSelected() ? IconTablerCheck : true}
                        {...option}
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
          })()}
        </div>
      }
    />
  )
}
