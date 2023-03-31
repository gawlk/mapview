import {
  StoryButton,
  StoryContainer,
  StoryDialog,
  StoryDialogSelect,
  StoryIcon,
  StoryIconInteractive,
  StoryInput,
  StoryInteractive,
  StoryNavigator,
} from '/src/components'

export default () => {
  return (
    <div class="space-y-8 p-8">
      <StoryContainer />
      <StoryIcon />
      <StoryIconInteractive />
      <StoryInteractive />
      <StoryButton />
      <StoryInput />
      <StoryDialogSelect />
      <StoryDialog />
      <StoryNavigator />
    </div>
  )
}
