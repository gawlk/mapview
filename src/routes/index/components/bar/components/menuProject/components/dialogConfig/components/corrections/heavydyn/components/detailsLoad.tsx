import { useI18n } from '@solid-primitives/i18n'

import { roundValue } from '/src/scripts'

import { InputRadioAbled } from './inputRadioAbled'

import { Details, DialogSelect, Input } from '/src/components'

interface Props {
  project: HeavydynProject
}

export const DetailsLoad = (props: Props) => {
  const [t] = useI18n()

  const load = createMemo(() => props.project.correctionParameters.load)

  return (
    <Details
      defaultOpen
      locked
      button={{
        leftIcon: IconTablerWeight,
        label: t('Load'),
        text: load().active ? t('Enabled') : t('Disabled'),
      }}
    >
      <InputRadioAbled
        active={load().active}
        onChange={(value) => (load().active = value)}
      />
      <DialogSelect
        attached
        button={{
          label: t('Source'),
          full: true,
        }}
        onClose={(value) => value && load().source.selectIndex(Number(value))}
        values={{
          selected: t(load().source.selected || ''),
          list: load().source.list.map((str, index) => ({
            value: String(index),
            text: t(str),
          })),
        }}
      />
      <Show when={load().source.selected === 'Custom' && load().customValue}>
        {(mathNumber) => (
          <Input
            leftIcon={IconTabler123}
            label={t('Value')}
            full
            value={roundValue(mathNumber().toCurrent())}
            onInput={(value) =>
              mathNumber().updateValue(Number(value || 0), true)
            }
          />
        )}
      </Show>
    </Details>
  )
}
