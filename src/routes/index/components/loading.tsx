import { useI18n } from "@solid-primitives/i18n"

export default () => {
  const [t] = useI18n()
  
  return <div class="absolute inset-0 z-10 h-screen w-screen backdrop-blur">
  <div class="flex h-full flex-col items-center justify-center space-y-2">
    <svg
      class="h-24 w-24 animate-spin text-black/20 sm:h-32 sm:w-32"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M12 6l0 -3"></path>
      <path d="M16.25 7.75l2.15 -2.15"></path>
      <path d="M18 12l3 0"></path>
      <path d="M16.25 16.25l2.15 2.15"></path>
      <path d="M12 18l0 3"></path>
      <path d="M7.75 16.25l-2.15 2.15"></path>
      <path d="M6 12l-3 0"></path>
      <path d="M7.75 7.75l-2.15 -2.15"></path>
    </svg>
    <p class="font-medium">{t('Opening in progress...')}</p>
  </div>
</div>
}