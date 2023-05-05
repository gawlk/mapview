import { addLocationToID, localStorageSetItem } from '/src/scripts'

import {
  Dialog,
  DialogOptions,
  Input,
  classPropToString,
} from '/src/components'

import { convertListToOptions, optionToJSXElement } from '../options/scripts'

export interface Props
  extends MergePropsWithHTMLProps<
    DialogSelectProps,
    Solid.JSX.DialogHTMLAttributes
  > {}

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

  // TODO: Show option icon if none

  return (
    <Dialog
      // TODO: Clean props before spreading
      {...props}
      button={mergeProps(
        {
          id,
          role: 'listbox' as const,
          leftIcon: IconTablerList,
          rightIcon: IconTablerSelector,
          text: getDialogButtonText(),
        } as InternalButtonProps,
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
          <DialogOptions input={state.input} options={props.options} />
        </div>
      }
    />
  )
}
