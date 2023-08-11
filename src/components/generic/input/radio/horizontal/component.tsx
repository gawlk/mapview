import { run } from '/src/scripts'

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

export const InputRadioHorizontal = (props: Props) => {
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
