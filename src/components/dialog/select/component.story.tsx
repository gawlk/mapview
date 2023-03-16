import { DialogSelect, Label } from '/src/components'

export default () => {
  const [state, setState] = createStore({
    value1: '1',
  })
  return (
    <Label label="Select (Dialog)">
      <DialogSelect
        title="title"
        button={{
          label: 'Value',
        }}
        options={{
          selected: state.value1,
          list: ['1', '2', '3'],
        }}
        onClose={(value) => {
          console.log(value)

          value && setState('value1', value)
        }}
      />
      <DialogSelect
        title="title"
        button={{
          label: 'Value',
        }}
        search={{
          placeholder: 'Value',
        }}
        options={{
          selected: state.value1,
          list: ['1', '2', '3'],
        }}
        onClose={(value) => {
          console.log(value)

          value && setState('value1', value)
        }}
      />
    </Label>
  )
}
