type DialogClassicProps = DialogClassicPropsOnly & DialogPropsWithHTMLAttributes

interface DialogClassicPropsOnly {
  attached?: true
  button?: InternalButtonProps
}

type InternalButtonProps = InternalButtonPropsOnly &
  ButtonPropsWithHTMLAttributes

interface InternalButtonPropsOnly {
  text?: string | (() => JSXElement)
}
