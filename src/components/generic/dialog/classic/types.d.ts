type DialogClassicProps = DialogClassicPropsOnly & DialogPropsWithHTMLAttributes

interface DialogClassicPropsOnly {
  readonly attached?: true
  readonly button?: InternalButtonProps
}

type InternalButtonProps = InternalButtonPropsOnly &
  ButtonPropsWithHTMLAttributes

interface InternalButtonPropsOnly {
  readonly text?: string | (() => JSXElement)
}
