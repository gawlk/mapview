import {
  StoryButton,
  StoryContainer,
  StoryDialog,
  StoryDialogColor,
  StoryDialogSelect,
  StoryIcon,
  StoryIconInteractive,
  StoryInput,
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
      <StorySortableList />
      {/* <StoryInputRadioHorizontal />
      <StoryDialog />
      <StoryDialogSelect />
      <StoryDialogColor />
      <StoryNavigator /> */}
    </div>
  )
}
