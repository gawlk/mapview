import {
  classPropToString,
  Dialog,
  DialogOptions,
  Input,
  valueWithTextToJSXElement,
} from '/src/components'
import { addLocationToID, localStorageSetItem } from '/src/scripts'

import { convertDialogValuesPropsListToValuesWithTextProps } from '../options/scripts'

export interface DialogSelectPropsWithHTMLAttributes
  extends MergePropsWithHTMLProps<DialogSelectProps, DialogHTMLAttributes> {}

export const DialogSelect = (props: DialogSelectPropsWithHTMLAttributes) => {
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

  const isAttached = createMemo(() => !!props.attached)

  const getDialogButtonText = () => {
    const option =
      typeof props.values.selected === 'number'
        ? convertDialogValuesPropsListToValuesWithTextProps(
            props.values.list,
          ).at(props.values.selected)
        : convertDialogValuesPropsListToValuesWithTextProps(
            props.values.list,
          ).find(
            (_option) =>
              _option.value === props.values.selected ||
              _option.text === props.values.selected,
          )

    return option ? valueWithTextToJSXElement(option) : undefined
  }

  // TODO: Show option icon if none

  return (
    <Dialog
      closeable
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
        props.button,
      )}
      onClose={(value?: string) => {
        if (props.saveable) {
          localStorageSetItem(id, value)
        }

        props.onClose?.(value)
      }}
      sticky={
        props.search ? (
          <div class={classPropToString([isAttached() ? 'px-2 pt-2' : 'px-4'])}>
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
        /* TODO: Add props component that would be displayed before this div */
        <div
          class={classPropToString([
            isAttached() ? 'space-y-1.5' : 'space-y-2',
          ])}
        >
          <DialogOptions input={state.input} options={props.values} />
        </div>
      }
    />
  )
}
