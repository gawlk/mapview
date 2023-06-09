import { useI18n } from '@solid-primitives/i18n'

import { DialogSelect } from '/src/components'

interface Props {
  thresholds?: ThresholdsGroupChoices
}

export default (props: Props) => {
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
        // TODO: Remove default value once https://github.com/solidjs-community/solid-primitives/issues/382 is fixed
        selected: t(
          props.thresholds?.selected?.name || '',
          undefined,
          props.thresholds?.selected?.name
        ),
        list: (props.thresholds?.list || []).map(
          // TODO: Same as the previous TODO
          (threshold, index) => ({
            value: String(index),
            text: t(threshold.name, undefined, threshold.name),
          })
        ),
      }}
    />
  )
}
