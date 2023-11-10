import { Label } from '/src/components'
import { useAppState } from '/src/index'

import { DetailsLoad } from './components/detailsLoad'
import { DetailsTemperature } from './components/detailsTemperature'

interface Props {
  readonly project: HeavydynProject
}

export const HeavydynCorrections = (props: Props) => {
  const { t } = useAppState()

  return (
    <Label size="lg" label={t('Corrections')} class="space-y-4">
      <DetailsLoad project={props.project} />
      <DetailsTemperature project={props.project} />
    </Label>
  )
}
