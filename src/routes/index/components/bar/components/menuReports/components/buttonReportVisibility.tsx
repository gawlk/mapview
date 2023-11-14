import { Button } from '/src/components'

interface Props {
  readonly isVisible: ASS<boolean>
}

export const ButtonReportVisibility = (props: Props) => {
  return (
    <Button
      icon={props.isVisible() ? IconTablerEye : IconTablerEyeOff}
      onClick={() => props.isVisible.set((v) => !v)}
    />
  )
}
