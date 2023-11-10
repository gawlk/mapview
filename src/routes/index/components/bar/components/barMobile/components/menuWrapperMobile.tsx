import { classPropToString, stylePropToCSSProperties } from '/src/components'

interface Props {
  readonly id: string
  readonly disabled: boolean
  readonly icon: ValidComponent | undefined
  readonly name: string
  readonly opened?: boolean
  readonly style?: string
  readonly class?: string
  readonly onClick: VoidFunction
}

export const baseID = 'mobile-menu-'

export const MenuWrapperMobile = (props: Props) => {
  return (
    <>
      <button
        onClick={props.onClick}
        class={classPropToString([
          props.disabled
            ? 'cursor-default opacity-25'
            : 'cursor-pointer hover:text-gray-600',
          props.opened && 'text-gray-600',
          'flex w-full flex-col items-center justify-center p-2 text-gray-400 focus:outline-none',
        ])}
      >
        <Dynamic class="h-5 w-5" component={props.icon} />
        <span class="text-xs font-medium leading-6">{props.name}</span>
      </button>
      <div
        class={classPropToString([
          !props.opened && 'hidden',
          'absolute inset-x-0 bottom-0 z-10 mb-[4.75rem] bg-transparent',
        ])}
      >
        <div
          style={stylePropToCSSProperties(props.style)}
          id={`${baseID}${props.id}`}
          class={classPropToString([
            'space-y-2 rounded-lg bg-white p-2',
            props.class || '',
          ])}
        />
      </div>
    </>
  )
}
