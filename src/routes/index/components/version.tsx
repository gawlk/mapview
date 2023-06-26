import packageJSONRaw from '/src/../package.json?raw'

const packageJSON = JSON.parse(packageJSONRaw)

export default () => {
  return <span class="absolute right-0 top-0 m-2 rounded-full bg-white px-1.5 py-0.5 text-xs font-extrabold tracking-tight text-black opacity-50">
  v. {packageJSON.version}
</span>
}