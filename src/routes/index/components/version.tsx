import packageJSONRaw from '/src/../package.json?raw'
import { env } from '/src/env'

const packageJSON = JSON.parse(packageJSONRaw)
const sha = import.meta.env.VITE_COMMIT_REF

const SpanVersion = (props: ParentProps) => {
  return (
    <span class="absolute right-0 top-0 m-2 rounded-full bg-white px-1.5 py-0.5 text-xs font-extrabold tracking-tight text-black opacity-50">
      {props.children}
    </span>
  )
}

export const Version = () => {
  return (
    <Show
      when={!env.isProd}
      fallback={<SpanVersion>V.{packageJSON.version}</SpanVersion>}
    >
      <a
        href={`https://gitlab.com/isaan/mapview-dev/mapview2/-/commit/${sha}`}
        target="_blank"
      >
        <SpanVersion>
          Beta V.{packageJSON.version} ({sha?.substr(0, 8)})
        </SpanVersion>
      </a>
    </Show>
  )
}
