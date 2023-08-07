import { Button, Container, InputRadioHorizontal, Label } from '/src/components'

export const InputRadioHorizontalStory = () => {
  const [state, setState] = createStore({
    selected: 'Enable',
  })

  return (
    <Label label="Input Radio Group Horizontal">
      <div class="flex space-x-1">
        <Container
          border={false}
          class="inline-block space-x-1"
          padding="xs"
          color="secondary"
        >
          <Button size="sm">
            <input type="radio" class="sr-only" />
            Enable
          </Button>
          <Button size="sm" color={'transparent'}>
            <input type="radio" class="sr-only" />
            Disable
          </Button>
        </Container>
        <InputRadioHorizontal
          values={{
            selected: state.selected,
            list: ['Enable', 'Disable'],
          }}
          onChange={(value) => setState('selected', value)}
        />
        <Button>Hey</Button>
      </div>
      <Button>Hey</Button>
    </Label>
  )
}
