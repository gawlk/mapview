import Logo from '/src/assets/svg/mapview/logo.svg'
import { IconInteractive, Label } from '/src/components'

export const IconInteractiveStory = () => {
  return (
    <Label label="Icon (in Interactive)">
      <IconInteractive icon={Logo} side="left" />

      <IconInteractive icon={Logo} />

      <IconInteractive icon={Logo} side="right" />
    </Label>
  )
}
