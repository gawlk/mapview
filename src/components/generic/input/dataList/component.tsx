import {
  classPropToString,
  dialogClassicBooleanPropsKeysObject,
  DialogCore,
  DialogOptions,
  Input,
  removeProps,
} from '/src/components'

interface Props extends InputDataListProps {}

export const InputDataList = (props: Props) => {
  const [state, setState] = createStore({
    value: String(props.value) || '',
    wrapper: undefined as HTMLDivElement | undefined,
    input: undefined as HTMLInputElement | undefined,
    id: '',
  })

  let openDialog: DialogOpenFunction | undefined

  const dialogProps = removeProps(
    props.dialog || {},
    dialogClassicBooleanPropsKeysObject,
  )

  const onInput = (value: string) => {
    setState('value', value)
    props.onInput?.(value)
  }

  return (
    <div
      class={classPropToString([props.full && 'w-full'])}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <Input
        {...removeProps(props, {
          list: true,
        })}
        value={state.value}
        bind
        for={state.id}
        onInput={(value) => onInput(value || '')}
        title={props.title || props.dialog?.title}
        class={['relative', props.class]}
        wrapperRef={(wrapper) => setState('wrapper', wrapper)}
        ref={(input) => setState('input', input)}
        onClick={(event) => {
          openDialog?.(event.isTrusted)

          state.input?.focus()
        }}
      />

      <DialogCore
        {...dialogProps}
        attach={state.wrapper}
        onIdCreated={(id) => setState('id', id)}
        onOpenCreated={(open) => {
          openDialog = open
        }}
        onClose={(value) => value && onInput(value)}
        form={
          <div class="space-y-1">
            <DialogOptions
              input={state.value}
              showAllWhenEmpty
              options={{
                selected: state.value || '',
                list: props.list,
              }}
            />
          </div>
        }
      />
    </div>
  )
}
