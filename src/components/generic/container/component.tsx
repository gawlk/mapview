import {
  baseBooleanPropsKeysObject,
  classPropToString,
  containerBooleanPropsKeysObject,
  removeProps,
  stylePropToCSSProperties,
} from '/src/components'

type Props = ContainerPropsWithHTMLAttributes

// TODO: Make classes opt in

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
              return 'text-black/90'
            case 'red':
              return 'text-red-900'
            case 'green':
              return 'text-green-900'
            case 'orange':
              return 'text-orange-900'
            default:
              return 'text-black/90'
          }
        })(),

        // Background color
        (() => {
          switch (props.color) {
            case 'primary':
              return 'bg-orange-700'
            case 'secondary':
              return 'bg-black bg-opacity-5'
            case 'gray':
              return 'bg-neutral-100'
            case 'red':
              return 'bg-red-200'
            case 'green':
              return 'bg-green-200'
            case 'orange':
              return 'bg-orange-200'
            case 'transparent':
              return 'bg-transparent'
            default:
              return 'bg-white'
          }
        })(),

        // Border width
        (() => {
          if (props.border !== false) {
            switch (props.size) {
              default:
                return 'border-2'
            }
          }
        })(),

        // Border color
        (() => {
          switch (props.color) {
            case 'primary':
            case 'secondary':
            case 'red':
            case 'green':
            case 'orange':
            case 'transparent':
              return 'border-transparent'
            case 'tertiary':
              return 'border-transparent hover:border-neutral-600'
            default:
              return 'border-black border-opacity-5'
          }
        })(),

        // Padding
        (() => {
          switch (props.padding || props.size) {
            case 'xs':
              return (() => {
                switch (props.orientation) {
                  case 'horizontal':
                    return 'px-2 py-1'
                  case 'vertical':
                    return 'px-1 py-2'
                  default:
                    return 'p-1'
                }
              })()
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
              return props.size === 'xs' || props.size === 'sm'
                ? 'rounded-md'
                : 'rounded-lg'
          }
        })(),

        // Text size
        (() => {
          switch (props.size) {
            case 'sm':
              return 'text-sm'
            case 'xs':
              return 'text-xs'
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
