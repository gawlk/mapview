import { Details, DialogSelect, Input } from '/src/components'
import { useAppState } from '/src/index'
import { roundValue } from '/src/scripts'

import { InputRadioAbled } from './inputRadioAbled'

interface Props {
  readonly project: HeavydynProject
}

export const DetailsLoad = (props: Props) => {
  const { t } = useAppState()

  const load = createMemo(() => props.project.correctionParameters.load)

  return (
    <Details
      defaultOpen
      locked
      button={{
        leftIcon: IconTablerWeight,
        label: t('Correction'),
        text: t('Load'),
      }}
    >
      <InputRadioAbled active={load().active()} onChange={load().active.set} />
      <DialogSelect
        attached
        button={{
          label: t('Source'),
          full: true,
        }}
        onClose={(value) => value && load().source.selectIndex(Number(value))}
        values={{
          selected: t(load().source.selected() || ''),
          list: load()
            .source.list()
            .map((str, index) => ({
              value: String(index),
              text: t(str),
            })),
        }}
      />
      <Show when={load().source.selected() === 'Custom' && load().customValue}>
        {(mathNumber) => (
          <Input
            leftIcon={IconTabler123}
            label={t('Value')}
            full
            value={roundValue(mathNumber().toCurrent())}
            onInput={(value) => mathNumber().setValue(Number(value || 0), true)}
            suffix={load().customValue.unit.currentUnit()}
          />
        )}
      </Show>
    </Details>
  )
}
