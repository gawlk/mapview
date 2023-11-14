interface NavigatorComponentProps {
  readonly next: (id: string) => void
  readonly reset: VoidFunction
  readonly back?: VoidFunction
}
