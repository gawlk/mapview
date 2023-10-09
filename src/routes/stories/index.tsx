/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ButtonStory,
  ContainerStory,
  DialogColorStory,
  DialogSelectStory,
  DialogStory,
  HeadlessDialogStory,
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
  return (
    <div class="space-y-8 p-8">
      {/* <ContainerStory />
      <IconStory />
      <IconInteractiveStory />
      <InteractiveStory />
      <ButtonStory />
      <InputStory />
      

      <DialogSelectStory />
      <InputDataListStory /> */}
      {/* <SortableListStory /> */}
      <DialogStory />
      <HeadlessDialogStory />
      {/* <InputRadioHorizontalStory />

      <DialogColorStory />
      <NavigatorStory /> */}
    </div>
  )
}

export default Stories
