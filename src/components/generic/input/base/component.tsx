import {
  baseBooleanPropsKeysObject,
  booleanPropsKeysToArray,
  Button,
  classPropToString,
  containerBooleanPropsKeysObject,
  inputBooleanPropsKeysObject,
  Interactive,
  interactiveBooleanPropsKeysObject,
  removeProps,
} from '/src/components'
import { addLocationToID, debounce, localStorageSetItem } from '/src/scripts'

type Props = InputPropsWithHTMLAttributes

export const Input = (props: Props) => {
  const [interactiveProps, inputProps] = splitProps(
    removeProps(props, { ...inputBooleanPropsKeysObject, onClick: true }),
    booleanPropsKeysToArray([
      interactiveBooleanPropsKeysObject,
      containerBooleanPropsKeysObject,
      baseBooleanPropsKeysObject,
    ]) as never[],
  )

  const [state, setState] = createStore({
    value: props.value,
  })

  let id: string | undefined
  let input: HTMLInputElement | undefined

  if (props.id) {
    id = addLocationToID(props.id)

    if (props.saveable) {
      const saved = localStorage.getItem(id)

      saved && String(saved) !== String(props.value) && props.onInput?.(saved)
    }
  }

  const type = createMemo(
    () =>
      props.type ||
      (props.max || props.min || props.step || typeof props.value === 'number'
        ? 'number'
        : undefined),
  )

  const needsFixing = createMemo(
    () =>
      !props.disabled &&
      type() === 'number' &&
      ((props.max !== undefined && Number(state.value) > props.max) ||
        (props.min !== undefined &&
          (!state.value || Number(state.value) < props.min))),
  )

  const debounceInputPropagation = debounce(
    (value: string | undefined, event: InputEvent) => {
      if (props.saveable) {
        localStorageSetItem(id, value)
      }

      // Push the input to the end of the task for maximum fluidity
      setTimeout(() => props.onInput?.(value, event), 0)
    },
    props.debounce || 50,
  )

  onMount(() => {
    // Init input's value without binding to improve performance
    input && (input.value = String(state.value ?? ''))

    createEffect(() => {
      if (props.bind && input) {
        setState('value', props.value)

        input.value = String(props.value)
      }
    })
  })

  return (
    <div
      class={classPropToString([
        props.full && 'w-full',
        'inline-flex flex-1 space-x-2',
      ])}
      ref={props.wrapperRef}
      // Types failing
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onClick={props.onClick}
    >
      <Interactive
        bgColor="base"
        kind="focusable"
        rightIcon={props.readOnly ? IconTablerLock : undefined}
        {...interactiveProps}
        class={[
          'relative cursor-text',
          needsFixing() && 'border-red-500',
          props.class,
        ]}
        onClick={() => input?.focus()}
      >
        <Dynamic
          component={props.long ? 'textarea' : 'input'}
          class={classPropToString([
            needsFixing() && 'text-red-600',
            props.long && 'min-h-[50px]',
            'w-full flex-1 bg-transparent text-left placeholder:text-stone-400 focus:outline-none',
          ])}
          id={id}
          aria-invalid={needsFixing()}
          disabled={props.disabled}
          {...inputProps}
          ref={(inputRef: HTMLInputElement) => {
            input = inputRef
            props.ref?.(input)
          }}
          {...(props.long ? { rows: 5 } : {})}
          type={type()}
          onInput={(event: InputEvent) => {
            const element = event.target as HTMLInputElement

            const value = element.value

            setState('value', value)

            debounceInputPropagation(value, event)
          }}
          {...(type() === 'range' ? { min: props.min, max: props.max } : {})}
        />
      </Interactive>
      <Show when={needsFixing()}>
        <Button
          icon={IconTablerHammer}
          onClick={() => {
            const value = String(
              typeof state.value !== 'number' ||
                (props.min !== undefined && state.value < props.min)
                ? props.min
                : props.max,
            )

            input && (input.value = value)

            setState('value', value)

            if (props.saveable) {
              localStorageSetItem(id)
            }

            props.onInput?.(value)
          }}
        />
      </Show>
    </div>
  )
}
