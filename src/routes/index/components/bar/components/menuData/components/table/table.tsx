interface Props extends Solid.ParentProps {}

export default (props: Props) => {
  return (
    <div class="overflow-x-auto">
      <table class="w-full table-auto text-sm font-medium">
        {props.children}
      </table>
    </div>
  )
}
