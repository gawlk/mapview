interface Props extends ParentProps {}

export const Table = (props: Props) => {
  return (
    <table class="relative w-full table-auto text-sm font-medium">
      {props.children}
    </table>
  )
}
