import { Button } from '/src/components'

import Sun0 from '/src/assets/svg/custom/sun0.svg'
import Sun25 from '/src/assets/svg/custom/sun25.svg'
import Sun50 from '/src/assets/svg/custom/sun50.svg'
import Sun75 from '/src/assets/svg/custom/sun75.svg'
import Sun100 from '/src/assets/svg/custom/sun100.svg'

interface Props {
  overlay: Overlay
}

export default (props: Props) => {
  const opacity = createMemo(() => props.overlay.opacity)

  const setOpacity = (opacity: 1 | 0.75 | 0.5 | 0.25 | 0) =>
    (props.overlay.opacity = opacity)

  return (
    <Button
      icon={
        opacity() === 1
          ? Sun100
          : opacity() === 0.75
          ? Sun75
          : opacity() === 0.5
          ? Sun50
          : opacity() === 0.25
          ? Sun25
          : Sun0
      }
      onClick={() => {
        switch (opacity()) {
          case 0:
            setOpacity(0.25)
            break
          case 0.25:
            setOpacity(0.5)
            break
          case 0.5:
            setOpacity(0.75)
            break
          case 0.75:
            setOpacity(1)
            break
          case 1:
            setOpacity(0)
            break
        }
      }}
    />
  )
}
