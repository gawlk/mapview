import { Button, Label } from '/src/components'

export const ButtonStory = () => {
  return (
    <Label label="Button">
      <Button full>Button full</Button>

      <Button leftIcon={IconTabler3dCubeSphere}>Button with left icon</Button>

      <Button
        id="labeled-button"
        leftIcon={IconTabler3dCubeSphere}
        full
        label="label"
      >
        <span class="truncate">
          This is a
          veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeery
          long text
        </span>
      </Button>

      <Button
        leftIcon={IconTablerHome}
        full
        rightIcon={IconTablerArrowAutofitRight}
      >
        full + both icons
      </Button>

      <Button icon={IconTablerHome} title="Button with a home icon" />

      <Button leftIcon={IconTablerHome} full rightIcon={IconTablerHome}>
        <span class="flex-1">full + flex-1</span>
      </Button>
    </Label>
  )
}
