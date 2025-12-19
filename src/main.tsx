import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { registerSW } from './serviceWorkers/aapversion'

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);


registerSW()