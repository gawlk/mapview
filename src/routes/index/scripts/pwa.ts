import store from '/src/store'

export const checkUpdate = async () => {
  if (!navigator.serviceWorker) {
    return
  }

  if (window.location.protocol === 'https:') {
    const registration = await navigator.serviceWorker.register('/sw.js')

    registration.addEventListener('updatefound', () => {
      const worker = registration.installing

      worker?.addEventListener('statechange', () => {
        if (
          worker.state === 'installed' &&
          navigator.serviceWorker.controller
        ) {
          store.updateAvailable = true
        }
      })
    })
  } else {
    const registrations = await navigator.serviceWorker.getRegistrations()

    if (registrations.length > 0) {
      registrations.forEach((registration) => {
        registration.unregister()
      })

      location.reload()
    }
  }
}
