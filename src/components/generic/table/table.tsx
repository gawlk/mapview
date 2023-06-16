interface Props extends Solid.ParentProps {}

export default (props: Props) => {
  return (
    <table class="relative w-full table-auto text-sm font-medium">
      {props.children}
    </table>
  )
}
