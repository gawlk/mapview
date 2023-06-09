import { DialogSelect, Label } from '/src/components'

export default () => {
  const [state, setState] = createStore({
    value1: '1',
  })
  return (
    <Label label="Select (Dialog)">
      <DialogSelect
        title="select fixed"
        button={{
          label: 'Value',
        }}
        values={{
          selected: state.value1,
          list: ['1', '2', '3'],
        }}
        onClose={(value) => {
          value && setState('value1', value)
        }}
      />
      <DialogSelect
        title="select absolute"
        attached
        button={{
          label: 'Value',
        }}
        values={{
          selected: state.value1,
          list: ['1', '2', '3'],
        }}
        onClose={(value) => {
          value && setState('value1', value)
        }}
      />
      <DialogSelect
        title="select search fixed"
        button={{
          label: 'Value',
        }}
        search={{
          placeholder: 'Value',
        }}
        values={{
          selected: state.value1,
          list: ['1', '2', '3'],
        }}
        onClose={(value) => {
          value && setState('value1', value)
        }}
      />
      <DialogSelect
        title="select search absolute"
        attached
        button={{
          label: 'Value',
        }}
        search={{
          placeholder: 'Value',
        }}
        values={{
          selected: state.value1,
          list: ['1', '2', '3'],
        }}
        onClose={(value) => {
          value && setState('value1', value)
        }}
      />
    </Label>
  )
}
