interface Props extends Solid.ParentProps {
  onClose: () => void
}

export const Sticky = (props: Props) => {
  return (
    <div class="fixed inset-x-0 top-0 z-10 bg-orange-600">
      <div class="flex w-full items-center px-3 py-1.5 sm:px-5 lg:px-7">
        <div class="w-full pr-16 sm:px-16 sm:text-center">
          <p class="font-medium text-white">{props.children}</p>
        </div>

        <button
          class="flex rounded-md p-2 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-white"
          onClick={props.onClose}
          type="button"
        >
          <span class="sr-only">Dismiss</span>
          <IconTablerX class="h-5 w-5 text-white" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
