import { DialogSelect } from '/src/components'
import { useAppState } from '/src/index'

import { SpanThresholdName } from './spanThresoldName'

interface Props {
  readonly thresholds?: ThresholdsGroupChoices
  readonly mathUnit?: MathUnit<string>
}

export const SelectThreshold = (props: Props) => {
  const { t } = useAppState()

  return (
    <DialogSelect
      attached
      button={{
        full: true,
        label: t('Selected'),
      }}
      onClose={(value) => value && props.thresholds?.selectIndex(Number(value))}
      values={{
        selected: props.thresholds?.selectedIndex() ?? null,
        list: (props.thresholds?.list() || []).map((threshold, index) => ({
          value: String(index),
          text: () => (
            <SpanThresholdName
              threshold={threshold}
              mathUnit={props.mathUnit}
            />
          ),
        })),
      }}
    />
  )
}
