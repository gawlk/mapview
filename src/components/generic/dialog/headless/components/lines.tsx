interface Props {
  top: number
  width: number
  zIndex?: number
}

export const DialogSnapLines = (props: Props) => {
  return (
    <Show when={props.zIndex}>
      <div
        style={{
          display: 'flex',
          position: 'fixed',
          inset: '0px',
          'justify-content': 'center',
          'z-index': props.zIndex,
        }}
      >
        <hr
          style={{
            position: 'absolute',
            width: '100%',
            top: `calc(${props.top}px - 1px)`,
            'border-style': 'dashed',
            'border-color': 'rgb(0 0 0 / 0.2)',
          }}
        />
        <div
          style={{
            height: '100%',
            'border-left-width': '1px',
            'border-right-width': '1px',
            width: `${props.width + 2}px`,
            'border-style': 'dashed',
            'border-color': 'rgb(0 0 0 / 0.2)',
            'min-width': `calc(${props.width} + 2px)`,
          }}
        />
      </div>
    </Show>
  )
}
