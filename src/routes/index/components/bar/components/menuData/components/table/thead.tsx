interface Props extends Solid.ParentProps {}

export default (props: Props) => {
  return (
    <thead class="">
      <tr class="border-b-2 border-black/10 bg-black/5">{props.children}</tr>
    </thead>
  )
}
