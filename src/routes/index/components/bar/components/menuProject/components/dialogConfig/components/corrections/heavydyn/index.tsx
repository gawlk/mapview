import { useI18n } from '@solid-primitives/i18n'

import { Label } from '/src/components'

import { DetailsLoad } from './components/detailsLoad'
import { DetailsTemperature } from './components/detailsTemperature'

interface Props {
  project: HeavydynProject
}

export const HeavydynCorrections = (props: Props) => {
  const [t] = useI18n()

  return (
    <Label size="lg" label={t('Correction')} class="space-y-4">
      <DetailsLoad project={props.project} />
      <DetailsTemperature project={props.project} />
    </Label>
  )
}
