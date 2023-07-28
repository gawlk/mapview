import packageJSONRaw from '/src/../package.json?raw'
import env from '/src/env'

const packageJSON = JSON.parse(packageJSONRaw)
const sha = import.meta.env.VITE_COMMIT_REF

export default () => {
  return (
    <Switch>
      <Match when={env.isProd}>
        <span class="absolute right-0 top-0 m-2 rounded-full bg-white px-1.5 py-0.5 text-xs font-extrabold tracking-tight text-black opacity-50">
          V.{packageJSON.version}
        </span>
      </Match>
      <Match when={env.isDev}>
        <a
          href={`https://gitlab.com/isaan/mapview-dev/mapview2/-/commit/${sha}`}
          target="_blank"
        >
          <span class="absolute right-0 top-0 m-2 rounded-full bg-white px-1.5 py-0.5 text-xs font-extrabold tracking-tight text-black opacity-50">
            Beta V.{packageJSON.version} ({sha?.substr(0, 8)})
          </span>
        </a>
      </Match>
    </Switch>
  )
}
