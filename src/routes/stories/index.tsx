import {
  StoryButton,
  StoryContainer,
  StoryDialog,
  StoryDialogColor,
  StoryDialogSelect,
  StoryIcon,
  StoryIconInteractive,
  StoryInput,
  StoryInputDataList,
  StoryInputRadioHorizontal,
  StoryInteractive,
  StoryNavigator,
  StorySortableList,
} from '/src/components'

export default () => {
  return (
    <div class="space-y-8 p-8">
      {/* <StoryContainer />
      <StoryIcon />
      <StoryIconInteractive />
      <StoryInteractive />
      <StoryButton />
      <StoryInput /> */}
      <StoryDialog />

      <StoryDialogSelect />
      <StoryInputDataList />
      {/* <StorySortableList />
      <StoryInputRadioHorizontal />
      
      <StoryDialogColor />
      <StoryNavigator /> */}
    </div>
  )
}
