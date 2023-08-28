type Accessor<T> = import('solid-js').Accessor<T>

type Signal<T> = import('solid-js').Signal<T>
type SignalOptions<T> = import('solid-js').SignalOptions<T>

// eslint-disable-next-line @typescript-eslint/ban-types
type Component<T = {}> = import('solid-js').Component<T>

type ValidComponent = import('solid-js').ValidComponent

type ParentProps = import('solid-js').ParentProps

type EffectFunction<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Prev = any,
  Next extends Prev = Prev,
> = import('solid-js').EffectFunction<Prev, Next>

type Setter<T> = import('solid-js').Setter<T>

type JSXElement = import('solid-js').JSXElement

type EventHandlerUnion<
  T,
  E extends Event,
> = import('solid-js').JSX.EventHandlerUnion<T, E>

type CSSProperties = import('solid-js').JSX.CSSProperties

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HTMLAttributes<T = any> = import('solid-js').JSX.HTMLAttributes<T>
type ButtonHTMLAttributes =
  import('solid-js').JSX.ButtonHTMLAttributes<HTMLButtonElement>
type InputHTMLAttributes =
  import('solid-js').JSX.InputHTMLAttributes<HTMLInputElement>
type SelectHTMLAttributes =
  import('solid-js').JSX.SelectHTMLAttributes<HTMLSelectElement>
type DetailsHTMLAttributes =
  import('solid-js').JSX.DetailsHtmlAttributes<HTMLDetailsElement>
type DialogHTMLAttributes =
  import('solid-js').JSX.DialogHtmlAttributes<HTMLDialogElement>

type DeepReadonly<T> = import('solid-js/store').DeepReadonly<T>

type LinkProps = import('@solidjs/router').LinkProps
type RouteDefinition = import('@solidjs/router').RouteDefinition
