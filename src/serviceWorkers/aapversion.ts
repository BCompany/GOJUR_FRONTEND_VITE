export function registerSW() {
  if (!('serviceWorker' in navigator)) return

  window.addEventListener('load', async () => {
    const reg = await navigator.serviceWorker.register('/gojursw.js')

    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing
      if (!newWorker) return

      newWorker.addEventListener('statechange', () => {
        if (
          newWorker.state === 'installed' &&
          navigator.serviceWorker.controller
        ) {
          // força ativação e recarrega
          newWorker.postMessage({ type: 'SKIP_WAITING' })
          window.location.reload()
        }
      })
    })
  })
}