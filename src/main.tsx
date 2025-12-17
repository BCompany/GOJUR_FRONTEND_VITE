import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { Workbox } from 'workbox-window'

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);

if ('serviceWorker' in navigator) {

  const wb = new Workbox('/sw.js')

 

  wb.addEventListener('waiting', () => {

    wb.messageSW({ type: 'SKIP_WAITING' })

    window.location.reload()

  })

 

  wb.register()

}