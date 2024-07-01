import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import GlobalStyle from 'Shared/styles/GlobalStyle';
import AppProvider from './context';
import Routes from 'routes';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'Shared/styles/styles.css';

const App: React.FC = () => {
  const [screenWidht, setScreenWidht] = useState<number>();

  useEffect(() => {
    setScreenWidht(screen.availWidth);
  }, []);

  return (
    <Router>
      <AppProvider>
        <Routes />
      </AppProvider>
      <GlobalStyle widht={screenWidht} />
    </Router>
  );
};

export default App;
