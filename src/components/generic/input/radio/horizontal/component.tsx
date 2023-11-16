import {
  Button,
  Container,
  convertValuesPropsListToValuesWithTextProps,
  isValuePropSelected,
  removeProps,
  valueWithTextToJSXElement,
} from '/src/components'
import { useAppState } from '/src/index'
import { run } from '/src/scripts'

interface Props extends InteractiveProps {
  values: ValuesProps
  onChange: (value: string) => void
}

export const InputRadioHorizontal = (props: Props) => {
  const { t } = useAppState()

  return (
    <Container
      bgColor="base"
      border={false}
      padding="xs"
      {...removeProps(props, {
        onChange: true,
        values: true,
      })}
      class={[
        'inline-flex select-none items-center space-x-1',
        props.full && 'w-full',
        props.class,
      ]}
    >
      <Show when={props.label}>
        {(label) => (
          <span class="ml-3 mr-0.5 whitespace-pre text-black/50">
            {label()}
            {t(':')}
          </span>
        )}
      </Show>
      <For
        each={convertValuesPropsListToValuesWithTextProps(props.values.list)}
      >
        {(option, index) => {
          const isSelected = createMemo(() =>
            isValuePropSelected(props.values.selected, option, index()),
          )

          return (
            <Button
              padding="xs"
              full
              center
              onClick={() => props.onChange(option.value)}
              {...option}
              color={!isSelected() ? 'transparent' : props.color}
            >
              <input type="radio" class="sr-only" value={option.value} />
              {option.icon ? '' : run(valueWithTextToJSXElement(option))}
            </Button>
          )
        }}
      </For>
    </Container>
  )
}
