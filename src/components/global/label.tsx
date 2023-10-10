import { classPropToString } from '/src/components'
import { run } from '/src/scripts'

export interface LabelProps extends ParentProps, BaseProps {
  label: string | Element
  divRef?: (ref: HTMLDivElement) => void
}

export const Label = (props: LabelProps) => {
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const id = `${props.label?.toString()}-${Math.random()}`

  return (
    <div class="relative space-y-2">
      <label
        for={id}
        class={classPropToString([
          run(() => {
            switch (props.size) {
              case 'lg':
                return 'text-xl'
              default:
                return 'text-lg'
            }
          }),

          'sticky top-0 z-10 -my-0.5 mx-1 inline-block break-words rounded-full bg-white/90 px-3 py-1.5 font-semibold',
        ])}
      >
        {props.label}
      </label>
      <div
        ref={props.divRef}
        id={id}
        class={classPropToString(props.class) || 'space-y-2'}
      >
        {props.children}
      </div>
    </div>
  )
}
