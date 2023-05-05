type ButtonPropsWithHTMLAttributes = MergePropsWithHTMLProps<
  InteractiveProps,
  Solid.JSX.ButtonHTMLAttributes
>

type InternalButtonProps = InternalButtonPropsOnly &
  ButtonPropsWithHTMLAttributes

interface InternalButtonPropsOnly {
  text?: string | (() => Solid.JSX.Element)
}
