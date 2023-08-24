type PartialAngularStyleSignal<T> = Solid.Accessor<T> & {
  set?: Solid.Setter<T>
}

export const convertSignalToAngularStyleSignal = <T>(
  signal: Solid.Signal<T>,
) => {
  const getter = signal[0] as PartialAngularStyleSignal<T>

  getter.set = signal[1]

  return getter as AngularStyleSignal<T>
}

export const createAngularStyleSignal = <T>(
  value: T,
  options?: Solid.SignalOptions<T>,
) => {
  return convertSignalToAngularStyleSignal(createSignal(value, options))
}

export const createASS = createAngularStyleSignal
