interface Props {
  image: string
}

export const Image = (props: Props) => {
  return (
    <img
      class="mx-auto max-h-[70vh] w-auto rounded-lg border-4 border-white/50 bg-white object-cover shadow-lg"
      src={props.image}
    />
  )
}
