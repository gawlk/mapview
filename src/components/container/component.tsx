import {
  baseBooleanPropsKeysObject,
  classPropToString,
  containerBooleanPropsKeysObject,
  removeProps,
  stylePropToCSSProperties,
} from '/src/components'

type Props = ContainerPropsWithHTMLAttributes

export default (props: Props) => {
  const dynamicProps = removeProps(props, [
    baseBooleanPropsKeysObject,
    containerBooleanPropsKeysObject,
  ])

  return (
    <Dynamic
      {...mergeProps({ component: 'div' }, dynamicProps)}
      {...(props.style ? { style: stylePropToCSSProperties(props.style) } : {})}
      class={classPropToString([
        // Text color
        (() => {
          switch (props.color) {
            case 'primary':
              return 'text-black'
            default:
              return 'text-black'
          }
        })(),

        // Background color
        (() => {
          switch (props.color) {
            case 'primary':
              return 'bg-white'
            case 'transparent':
              return 'bg-transparent'
            default:
              return 'bg-white'
          }
        })(),

        // Border width
        (() => {
          switch (props.size) {
            default:
              return 'border-2'
          }
        })(),

        // Border color
        (() => {
          switch (props.color) {
            case 'primary':
              return 'border-white'
            case 'tertiary':
              return 'border-black'
            default:
              return 'border-neutral-100'
          }
        })(),

        // Padding
        (() => {
          switch (props.size) {
            case 'sm':
              return (() => {
                switch (props.orientation) {
                  case 'horizontal':
                    return 'px-3 py-1.5'
                  case 'vertical':
                    return 'px-1.5 py-3'
                  default:
                    return 'p-1.5'
                }
              })()
            default:
              return (() => {
                switch (props.orientation) {
                  case 'horizontal':
                    return 'px-4 py-2'
                  case 'vertical':
                    return 'px-2 py-4'
                  default:
                    return 'p-2'
                }
              })()
          }
        })(),

        // Roundness
        (() => {
          switch (props.rounded) {
            case 'full':
              return 'rounded-full'
            case 'none':
              return
            default:
              return 'rounded-lg'
          }
        })(),

        // Text color
        (() => {
          switch (props.color) {
            default:
              return 'text-black'
          }
        })(),

        // Text size
        (() => {
          switch (props.size) {
            case 'sm':
              return 'text-sm'
            default:
              return 'text-base'
          }
        })(),

        'break-words',

        props.class,
      ])}
    >
      {props.children}
    </Dynamic>
  )
}
