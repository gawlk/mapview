import {
  baseBooleanPropsKeysObject,
  classPropToString,
  containerBooleanPropsKeysObject,
  iconBooleanPropsKeysObject,
  interactiveBooleanPropsKeysObject,
  removeProps,
  stylePropToCSSProperties,
} from '/src/components'
import { run } from '/src/scripts'

interface Props extends MergePropsWithHTMLProps<IconProps> {}

export const Icon = (props: Props) => {
  const dynamicProps = removeProps(props, [
    baseBooleanPropsKeysObject,
    containerBooleanPropsKeysObject,
    interactiveBooleanPropsKeysObject,
    iconBooleanPropsKeysObject,
  ])

  const isSpan = createMemo(
    () =>
      !props.icon ||
      typeof props.icon === 'boolean' ||
      (typeof props.icon === 'string' && props.icon.startsWith('<')),
  )

  const isImage = createMemo(() => !isSpan() && typeof props.icon === 'string')

  const component = createMemo(() => {
    if (isSpan()) return 'span'
    if (isImage()) return 'img'
    return props.icon as Component
  })

  const additionalProps = createMemo(() => {
    if (isImage()) return { src: props.icon, loading: 'lazy' }
    if (isSpan() && props.icon !== true) return { innerHTML: props.icon }
    return {}
  })

  return (
    <Dynamic
      {...dynamicProps}
      {...(props.style ? { style: stylePropToCSSProperties(props.style) } : {})}
      component={component()}
      {...additionalProps()}
      class={classPropToString([
        run(() => {
          switch (props.size) {
            case '2xl':
              return 'h-10 w-10'
            case 'xl':
              return 'h-8 w-8'
            case 'lg':
              return 'h-6 w-6'
            case 'xs':
              return 'h-4 w-4'
            default:
              return 'h-5 w-5'
          }
        }),

        run(() => {
          if (isImage()) {
            return 'rounded-md object-contain'
          }

          switch (props.color) {
            case 'primary':
              return 'text-stone-500'
            case 'red':
              return 'text-red-500'
            case 'green':
              return 'text-green-500'
            default:
              return 'text-black opacity-30'
          }
        }),

        props.disabled ? 'transition-none' : 'transition duration-200',

        'flex-none',

        props.class,
      ])}
    />
  )
}
