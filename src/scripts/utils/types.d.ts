type AngularStyleSignal<T> = Solid.Accessor<T> & {
  readonly set: Solid.Setter<T>
}

type ASS<T> = AngularStyleSignal<T>
