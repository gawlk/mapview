import { Button, classPropToString } from '/src/components'

interface Props extends Solid.ParentProps {
  accept: string
  buttonText: string
  onInput: (value: FileList | null) => void
}

export default (props: Props) => {
  let file: HTMLInputElement | undefined

  const state = createMutable({
    dragging: false,
  })

  const drop = (dataTransfer: DataTransfer | null) => {
    state.dragging = false

    if (dataTransfer && dataTransfer.files) {
      props.onInput(dataTransfer.files)
    }
  }

  return (
    <div>
      <div
        class={classPropToString([
          state.dragging ? 'bg-gray-200' : 'bg-gray-100',
          'group relative hidden h-[55vh] w-full cursor-pointer items-center justify-center rounded-lg p-1.5 transition-colors duration-200 hover:bg-gray-200 lg:block',
        ])}
      >
        <div
          class={classPropToString([
            state.dragging ? 'border-gray-400' : 'border-gray-300',
            'font-gray-900 flex h-full w-full items-center justify-center rounded-lg border-[3px] border-dashed text-sm font-medium transition-colors duration-200 group-hover:border-gray-400',
          ])}
        >
          <div class="space-y-4">
            <IconTablerFilePlus class="mx-auto h-7 w-7 text-gray-400 transition-colors duration-200 group-hover:text-gray-500" />
            <p>{props.children}</p>
          </div>
        </div>

        <div
          class="absolute inset-0 h-full w-full"
          onClick={() => file?.click()}
          ondragenter={() => (state.dragging = true)}
          ondragleave={() => (state.dragging = false)}
          onDragOver={(event) => {
            event.preventDefault()
            event.stopPropagation()
          }}
          onDrop={(event) => {
            event.preventDefault()
            event.stopPropagation()
            drop(event.dataTransfer)
          }}
        />

        <input
          class="hidden"
          onChange={(event) =>
            props.onInput((event.target as HTMLInputElement)?.files)
          }
          accept={props.accept}
          type="file"
          ref={file}
        />
      </div>
      <Button
        class="lg:hidden"
        onClick={() => file?.click()}
        full
        leftIcon={IconTablerFilePlus}
      >
        {props.buttonText}
      </Button>
    </div>
  )
}
