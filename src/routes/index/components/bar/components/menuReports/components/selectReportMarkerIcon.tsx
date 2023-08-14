import { useI18n } from '@solid-primitives/i18n'

import { formatIconSVGForUI, icons } from '/src/scripts'

import { DialogSelect } from '/src/components'

interface Props {
  report: BaseReport
}

export const SelectReportMarkerIcon = (props: Props) => {
  const [t] = useI18n()

  return (
    <DialogSelect
      button={{
        text: '',
        icon: formatIconSVGForUI(icons[props.report.settings.iconName]),
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
        iconName && (props.report.settings.iconName = iconName as IconName)
      }}
    />
  )
}
