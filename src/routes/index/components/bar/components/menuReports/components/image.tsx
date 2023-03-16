interface Props {
  image: string
}

export default (props: Props) => {
  return (
    <img
      class="max-h-[70vh] rounded-lg border-4 border-white/50 bg-white"
      src={props.image}
    />
  )
}
