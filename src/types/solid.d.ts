declare namespace Solid {
  export type Accessor<T> = import('solid-js').Accessor<T>

  export type Signal<T> = import('solid-js').Signal<T>
  export type SignalOptions<T> = import('solid-js').SignalOptions<T>

  // eslint-disable-next-line @typescript-eslint/ban-types
  export type Component<T = {}> = import('solid-js').Component<T>

  export type ValidComponent = import('solid-js').ValidComponent

  export type ParentProps = import('solid-js').ParentProps

  export type EffectFunction<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Prev = any,
    Next extends Prev = Prev,
  > = import('solid-js').EffectFunction<Prev, Next>

  export type Setter<T> = import('solid-js').Setter<T>

  namespace JSX {
    export type Element = import('solid-js').JSXElement

    export type EventHandlerUnion<
      T,
      E extends Event,
    > = import('solid-js').JSX.EventHandlerUnion<T, E>

    export type CSSProperties = import('solid-js').JSX.CSSProperties

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export type HTMLAttributes<T = any> =
      import('solid-js').JSX.HTMLAttributes<T>
    export type ButtonHTMLAttributes =
      import('solid-js').JSX.ButtonHTMLAttributes<HTMLButtonElement>
    export type InputHTMLAttributes =
      import('solid-js').JSX.InputHTMLAttributes<HTMLInputElement>
    export type SelectHTMLAttributes =
      import('solid-js').JSX.SelectHTMLAttributes<HTMLSelectElement>
    export type DetailsHTMLAttributes =
      import('solid-js').JSX.DetailsHtmlAttributes<HTMLDetailsElement>
    export type DialogHTMLAttributes =
      import('solid-js').JSX.DialogHtmlAttributes<HTMLDialogElement>
  }

  namespace Store {
    export type DeepReadonly<T> = import('solid-js/store').DeepReadonly<T>
  }

  namespace Router {
    export type LinkProps = import('@solidjs/router').LinkProps
    export type RouteDefinition = import('@solidjs/router').RouteDefinition
  }
}
