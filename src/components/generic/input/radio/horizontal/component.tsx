import {
  Button,
  Container,
  convertValuesPropsListToValuesWithTextProps,
  isValuePropSelected,
  removeProps,
  valueWithTextToJSXElement,
} from '/src/components'

interface Props extends InteractiveProps {
  values: ValuesProps
  onChange: (value: string) => void
}

export default (props: Props) => {
  return (
    // TODO: Should be interactive ?
    <Container
      border={false}
      color="secondary"
      padding="xs"
      {...removeProps(props, {
        onChange: true,
        values: true,
      })}
      class={['inline-flex space-x-1', props.full && 'w-full', props.class]}
    >
      <For
        each={convertValuesPropsListToValuesWithTextProps(props.values.list)}
      >
        {(option, index) => {
          const isSelected = createMemo(() =>
            isValuePropSelected(props.values.selected, option, index())
          )

          return (
            <Button
              padding="xs"
              full
              center
              color={!isSelected() ? 'transparent' : undefined}
              onClick={() => props.onChange(option.value)}
              {...option}
            >
              <input type="radio" class="sr-only" value={option.value} />
              {option.icon ? '' : valueWithTextToJSXElement(option)()}
            </Button>
          )
        }}
      </For>
    </Container>
  )
}
