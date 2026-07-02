import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import GlobalStyle from 'Shared/styles/GlobalStyle';
import AppProvider from './context';
import Routes from 'routes';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'Shared/styles/styles.css';
import { PostHogProvider } from '@posthog/react'

const options = {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
  defaults: '2026-05-30',
} as const


const App: React.FC = () => {
  const [screenWidht, setScreenWidht] = useState<number>();

  useEffect(() => {
    setScreenWidht(screen.availWidth);
  }, []);

  return (

    <PostHogProvider
      apiKey={import.meta.env.VITE_POSTHOG_PROJECT_TOKEN}
      options={options}
    >
      <Router>
        <AppProvider>
          <Routes />
        </AppProvider>
        <GlobalStyle widht={screenWidht} />
      </Router>
    </PostHogProvider>
  );
};

export default App;
