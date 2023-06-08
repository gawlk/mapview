interface Props {
  show?: boolean
  onMouseDown: (direction: DialogResizeDirection) => void
  onDblClick: (dimensions: DialogDimensions) => void
}

export default (props: Props) => {
  // TODO: Create Resizer, SideResizer and CornerResizer components
  return (
    <Show when={props.show}>
      <div
        onMouseDown={() => props.onMouseDown('n')}
        onDblClick={() => props.onDblClick({ height: undefined })}
        class="absolute inset-x-0 top-0 -my-1.5 hidden h-3 w-full cursor-ns-resize md:block"
      />
      <div
        onMouseDown={() => props.onMouseDown('w')}
        onDblClick={() =>
          props.onDblClick({
            width: undefined,
          })
        }
        class="absolute bottom-0 left-0 top-0 -mx-1.5 hidden h-full w-3 cursor-ew-resize md:block"
      />
      <div
        onMouseDown={() => props.onMouseDown('s')}
        onDblClick={() => props.onDblClick({ height: undefined })}
        class="absolute inset-x-0 bottom-0 -my-1.5 hidden h-3 w-full cursor-ns-resize md:block"
      />
      <div
        onMouseDown={() => props.onMouseDown('e')}
        onDblClick={() => props.onDblClick({ width: undefined })}
        class="absolute bottom-0 right-0 top-0 -mx-1.5 hidden h-full w-3 cursor-ew-resize md:block"
      />

      <div
        onMouseDown={() => props.onMouseDown('nw')}
        onDblClick={() =>
          props.onDblClick({
            width: undefined,
            height: undefined,
          })
        }
        class="absolute left-0 top-0 -m-2 hidden h-6 w-6 cursor-nwse-resize md:block"
      />
      <div
        onMouseDown={() => props.onMouseDown('sw')}
        onDblClick={() =>
          props.onDblClick({
            width: undefined,
            height: undefined,
          })
        }
        class="absolute bottom-0 left-0 -m-2 hidden h-6 w-6 cursor-nesw-resize  md:block"
      />
      <div
        onMouseDown={() => props.onMouseDown('se')}
        onDblClick={() =>
          props.onDblClick({
            width: undefined,
            height: undefined,
          })
        }
        class="absolute bottom-0 right-0 -m-2 hidden h-6 w-6 cursor-nwse-resize md:block"
      />
      <div
        onMouseDown={() => props.onMouseDown('ne')}
        onDblClick={() =>
          props.onDblClick({
            width: undefined,
            height: undefined,
          })
        }
        class="absolute right-0 top-0 -m-2 hidden h-6 w-6 cursor-nesw-resize md:block"
      />
    </Show>
  )
}
