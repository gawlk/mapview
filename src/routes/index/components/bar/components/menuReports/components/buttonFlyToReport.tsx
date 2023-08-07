import { Button } from '/src/components'

interface Props {
  report: BaseReport
}

export const ButtonFlyToReport = (props: Props) => {
  return (
    <Button icon={IconTablerZoomIn} onClick={() => props.report.fitOnMap()} />
  )
}
