import React from 'react';
import { AuthProvider } from './AuthContext';
import { ToastProvider } from './toast';
import { DefaultSettingsProvider } from './defaultSettings';
import { HeaderProvider } from './headerContext';
import { CustomerProvider } from './customer';
import { TriggerProvider } from './trigger';
import { SecurityProvider } from './securityContext';
import { StateFilterProvider } from './statesContext';

const AppProvider: React.FC = ({ children }) => {
  return (
    <AuthProvider>
      <HeaderProvider>
        <SecurityProvider>
          <TriggerProvider>
            <CustomerProvider>
              <StateFilterProvider>
                <DefaultSettingsProvider>
                  <ToastProvider>{children}</ToastProvider>
                </DefaultSettingsProvider>
              </StateFilterProvider>
            </CustomerProvider>
          </TriggerProvider>
        </SecurityProvider>
      </HeaderProvider>
    </AuthProvider>
  );
};

export default AppProvider;
