import Sun0 from '/src/assets/svg/custom/sun0.svg'
import Sun25 from '/src/assets/svg/custom/sun25.svg'
import Sun50 from '/src/assets/svg/custom/sun50.svg'
import Sun75 from '/src/assets/svg/custom/sun75.svg'
import Sun100 from '/src/assets/svg/custom/sun100.svg'
import { Button } from '/src/components'

interface Props {
  readonly overlay: Overlay
}

export const ButtonOverlayOpacity = (props: Props) => {
  const opacity = props.overlay.opacity

  const icon = createMemo(() => {
    switch (opacity()) {
      case 1:
        return Sun100
      case 0.75:
        return Sun75
      case 0.5:
        return Sun50
      case 0.25:
        return Sun25
      default:
        return Sun0
    }
  })

  return (
    <Button
      icon={icon()}
      onClick={() => {
        switch (opacity()) {
          case 0:
            opacity.set(0.25)
            break
          case 0.25:
            opacity.set(0.5)
            break
          case 0.5:
            opacity.set(0.75)
            break
          case 0.75:
            opacity.set(1)
            break
          case 1:
            opacity.set(0)
            break
        }
      }}
    />
  )
}
