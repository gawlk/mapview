interface Props {
  top: number
  width: number
  zIndex?: number
}

export const DialogSnapLines = (props: Props) => {
  return (
    <div
      style={
        props.zIndex
          ? {
              'z-index': props.zIndex,
            }
          : {}
      }
      class="fixed inset-0 flex justify-center"
    >
      <hr
        class="absolute w-full border-dashed border-black/20"
        style={{ top: `calc(${props.top}px - 1px)` }}
      />
      <div
        class="h-full border-x border-dashed border-black/20"
        style={{
          width: `${props.width + 2}px`,
          'min-width': `calc(${props.width} + 2px)`,
        }}
      />
    </div>
  )
}
