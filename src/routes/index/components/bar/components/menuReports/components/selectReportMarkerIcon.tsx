import { DialogSelect } from '/src/components'
import { useAppState } from '/src/index'
import { formatIconSVGForUI, icons } from '/src/scripts'

interface Props {
  readonly iconName: ASS<IconName>
}

export const SelectReportMarkerIcon = (props: Props) => {
  const { t } = useAppState()

  return (
    <DialogSelect
      button={{
        text: '',
        icon: formatIconSVGForUI(icons[props.iconName()]),
      }}
      attached
      values={{
        selected: 0,
        list: (Object.keys(icons) as IconName[]).map((svgName) => {
          return {
            value: svgName,
            text: t(svgName),
            leftIcon: formatIconSVGForUI(icons[svgName]),
          }
        }),
      }}
      onClose={(iconName) => {
        iconName && props.iconName.set(iconName as IconName)
      }}
    />
  )
}
