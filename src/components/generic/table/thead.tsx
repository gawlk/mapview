interface Props extends Solid.ParentProps {}

export default (props: Props) => {
  return (
    <thead>
      <tr class="border-b-2  border-black/10 [&>td]:sticky [&>td]:top-0 [&>td]:z-10 [&>td]:bg-gray-100">
        {props.children}
      </tr>
    </thead>
  )
}
