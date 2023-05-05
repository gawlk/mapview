import { useI18n } from '@solid-primitives/i18n'

import { roundValue } from '/src/scripts'

import { Details, DialogSelect, Input } from '/src/components'

interface Props {
  project: HeavydynProject
}

export default (props: Props) => {
  const [t] = useI18n()

  const load = createMemo(() => props.project.correctionParameters.load)

  return (
    <Details
      defaultOpen={load().active}
      onClick={(open) => (load().active = open)}
      button={{
        leftIcon: IconTablerWeight,
        rightIconOpen: IconTablerCheck,
        rightIconClosed: IconTablerX,
        label: t('Load'),
        text: load().active ? t('Enabled') : t('Disabled'),
      }}
    >
      <DialogSelect
        position="relative"
        button={{
          label: t('Source'),
          full: true,
        }}
        onClose={(value) => value && load().source.selectIndex(Number(value))}
        options={{
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
