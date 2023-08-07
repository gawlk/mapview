import { InputDataList, Label } from '/src/components'

export const InputDataListStory = () => {
  const [state, setState] = createStore({
    value1: '',
    value2: 2,
  })

  return (
    <Label label="Input data list">
      <InputDataList list={['a', 'aaaaa', 'wfokweopfw']} />
    </Label>
  )
}
