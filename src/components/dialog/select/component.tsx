import { addLocationToID, localStorageSetItem } from '/src/scripts'

import { Button, Dialog, Input } from '/src/components'

export interface Props
  extends MergePropsWithHTMLProps<
    DialogSelectProps,
    Solid.JSX.DialogHTMLAttributes
  > {}

const listValueToString = (
  value: DialogSelectProps['list']['values'][number]
) =>
  typeof value === 'string'
    ? {
        value,
      }
    : value

const valueObjectToString = (value: DialogSelectValueObject) =>
  value.label || value.value

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

  return (
    <Dialog
      {...props}
      button={mergeProps(
        {
          id,
          role: 'listbox' as const,
          rightIcon: IconTablerSelector,
          text:
            typeof props.list.selected === 'number'
              ? valueObjectToString(
                  listValueToString(props.list.values[props.list.selected])
                )
              : props.list.values
                  .map((v) => listValueToString(v))
                  .find((obj) => obj.value === props.list.selected)?.label ||
                props.list.selected,
        } as ButtonPropsWithHTMLAttributes,
        props.button
      )}
      onClose={(value?: string) => {
        if (props.saveable) {
          localStorageSetItem(id, value)
        }

        props.onClose?.(value)
      }}
      sticky={
        props.search
          ? () => (
              <Input
                {...props.search}
                leftIcon={IconTablerListSearch}
                label="Name"
                full
                class={['flex-none', props.search?.class]}
                onInput={(value?: string) => setState('input', value)}
              />
            )
          : undefined
      }
      form={
        <div class="space-y-2">
          {() => {
            const list = createMemo(() =>
              (props.list.values || []).map(listValueToString).filter(
                (obj) =>
                  !state.input ||
                  (obj.label
                    ? typeof obj.label === 'string'
                      ? obj.label
                      : typeof obj.label === 'function'
                      ? // @ts-ignore
                        obj.label()?.textContent
                      : // @ts-ignore
                        obj.label.textContent
                    : obj.value
                  )
                    .toLowerCase()
                    .includes(state.input.toLowerCase())
              )
            )

            return (
              <Show when={list().length} fallback="The list is empty.">
                <For each={list()}>
                  {(obj, index) => {
                    const isSelected = createMemo(
                      () =>
                        (typeof props.list.selected === 'number' &&
                          index() === props.list.selected) ||
                        props.list.selected === obj.value ||
                        props.list.selected === obj.label
                    )

                    return (
                      <Button
                        full
                        leftIcon={obj.icon}
                        rightIcon={isSelected() ? IconTablerCheck : true}
                        value={obj.value}
                      >
                        <span class="w-full truncate text-left">
                          {valueObjectToString(obj)}
                        </span>
                      </Button>
                    )
                  }}
                </For>
              </Show>
            )
          }}
        </div>
      }
    />
  )
}
