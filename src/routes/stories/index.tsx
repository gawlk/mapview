import init, { fibonacci, rand } from 'wasm'

/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ButtonStory,
  ContainerStory,
  DialogColorStory,
  DialogSelectStory,
  DialogStory,
  IconInteractiveStory,
  IconStory,
  InputDataListStory,
  InputRadioHorizontalStory,
  InputStory,
  InteractiveStory,
  NavigatorStory,
  SortableListStory,
} from '/src/components'

export const Stories = () => {
  onMount(async () => {
    await init()

    console.log('fib(10)', fibonacci(10))

    console.log('rand', rand())
  })

  return (
    <div class="space-y-8 p-8">
      {/* <ContainerStory />
      <IconStory />
      <IconInteractiveStory />
      <InteractiveStory />
      <ButtonStory />
      <InputStory />
      <DialogStory />

      <DialogSelectStory />
      <InputDataListStory /> */}
      <SortableListStory />
      {/* <InputRadioHorizontalStory />

      <DialogColorStory />
      <NavigatorStory /> */}
    </div>
  )
}

export default Stories
