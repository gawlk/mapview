import { useI18n } from '@solid-primitives/i18n'

import DetailsLoad from './detailsLoad'
import DetailsTemperature from './detailsTemperature'

import { Label } from '/src/components'

interface Props {
  project: HeavydynProject
}

export default (props: Props) => {
  const [t] = useI18n()

  return (
    <Label size="lg" label={t('Correction')} class="space-y-4">
      <DetailsLoad project={props.project} />
      <DetailsTemperature project={props.project} />
    </Label>
  )
}
