interface Props extends ParentProps {
  close: (element?: HTMLElement) => void
}

export const DialogForm = (props: Props) => {
  return (
    <form
      class="h-full w-full"
      method="dialog"
      onSubmit={(event) => {
        event.preventDefault()
        props.close(event.submitter)
      }}
    >
      {props.children}
    </form>
  )
}
