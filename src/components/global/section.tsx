interface Props extends ParentProps {
  id: string
  number?: number
  title: string | Element
  description?: string | Element
}

export const Section = (props: Props) => {
  return (
    <section id={props.id} class="space-y-6">
      <h4 class="break-words text-2xl font-black tracking-tight">
        <Show when={props.number} fallback={props.title}>
          <div class="flex items-center space-x-3">
            <div
              style={{ 'font-size': '0.75em' }}
              class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-600"
            >
              <span>{props.number}</span>
            </div>
            <span>{props.title}</span>
          </div>
        </Show>
      </h4>
      <Show when={props.description}>
        <p class="text-white/50">{props.description}</p>
      </Show>
      {props.children}
    </section>
  )
}
