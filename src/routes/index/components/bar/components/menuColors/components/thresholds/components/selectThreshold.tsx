import { useI18n } from '@solid-primitives/i18n'

import { DialogSelect } from '/src/components'

import { SpanThresholdName } from './spanThresoldName'

interface Props {
  thresholds?: ThresholdsGroupChoices
  mathUnit?: MathUnit<string>
}

export const SelectThreshold = (props: Props) => {
  const [t] = useI18n()

  return (
    <DialogSelect
      attached
      button={{
        full: true,
        label: t('Selected'),
      }}
      onClose={(value) => value && props.thresholds?.selectIndex(Number(value))}
      values={{
        selected: props.thresholds?.selectedIndex ?? null,
        list: (props.thresholds?.list || []).map((threshold, index) => ({
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
