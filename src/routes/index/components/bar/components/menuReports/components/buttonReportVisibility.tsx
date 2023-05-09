import { Button } from '/src/components'

interface Props {
  report: BaseReport
}

export default (props: Props) => {
  return (
    <Button
      icon={props.report.settings.isVisible ? IconTablerEye : IconTablerEyeOff}
      onClick={() => {
        props.report.settings.isVisible = !props.report.settings.isVisible
      }}
    />
  )
}