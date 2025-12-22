import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { registerSW } from 'virtual:pwa-register'


const updateSW = registerSW({
  immediate: true,

  /*
  onRegisteredSW(swUrl, registration) {
    //
    if (registration) {
      setInterval(() => {
        registration.update()
      }, 60 * 1000) // a cada 1 minuto
    }
  },
  */

  onRegisteredSW(swUrl, registration) {
    if (!registration) return

    //quando o usuário volta para a aba
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        registration.update()
      }
    })

    //quando a conexão volta
    window.addEventListener('online', () => {
      registration.update()
    })
  },


  onNeedRefresh() {
    console.log('Nova versão detectada, recarregando...')
    window.location.reload()
  },

  onOfflineReady() {
    console.log('App pronto para uso offline')
  },
})


ReactDOM.createRoot(document.getElementById('root')!).render(<App />);

