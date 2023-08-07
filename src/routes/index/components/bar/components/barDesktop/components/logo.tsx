import MapviewLogo from '/src/assets/svg/mapview/logoFull.svg'

export const Logo = () => {
  return (
    <a class="mx-auto flex w-1/2 items-center" href="/">
      {/* @ts-ignore */}
      <MapviewLogo class="h-full w-full" />
    </a>
  )
}
