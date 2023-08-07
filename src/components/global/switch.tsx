import { classPropToString } from '/src/components'

interface Props {
  value: boolean
  icon?: IconProp
  leftIcon?: IconProp
  rightIcon?: IconProp
  onInput: (value: boolean) => void
}

export const Switch = (props: Props) => {
  return (
    <div class="ml-2 flex items-center space-x-2 px-2">
      <Show when={props.icon || props.leftIcon}>
        <Dynamic
          component={(props.icon || props.leftIcon) as Solid.ValidComponent}
          class={classPropToString([
            'h-5 w-5 text-gray-400 transition-opacity duration-200 ease-in-out',
            props.value && 'opacity-50',
          ])}
        />
      </Show>
      <input
        class="h-5 w-9 cursor-pointer appearance-none rounded-full bg-gray-300 bg-contain bg-left bg-no-repeat transition duration-200 ease-in-out checked:bg-gray-400 checked:bg-right focus:outline-none"
        type="checkbox"
        role="switch"
        onInput={(event) =>
          props.onInput((event.target as HTMLInputElement)?.checked)
        }
        checked={props.value}
        style="
    background-image: url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22-4 -4 8 8%22%3E%3Ccircle r=%223%22 fill=%22%23fff%22/%3E%3C/svg%3E');
    "
      />
      <Show when={props.rightIcon}>
        <Dynamic
          component={props.rightIcon as Solid.ValidComponent}
          class={classPropToString([
            !props.value && 'opacity-50',
            'h-5 w-5 text-gray-400 transition-opacity duration-200 ease-in-out',
          ])}
        />
      </Show>
    </div>
  )
}
