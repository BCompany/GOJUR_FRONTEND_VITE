import React, { createContext, useCallback, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from 'services/api';
import { parse, isAfter } from 'date-fns';
import { envProvider } from '../services/hooks/useEnv';

interface AuthState {
  token: string;
  name: string;
  userPhoto: string;
  id: string;
  companyId: string;
  tpoUser: string;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  name: string;
  companyId: string;
  id: string;
  userPhoto: string;
  tpoUser: string;
  isAuthenticated: string | null;

  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(localStorage.getItem('@GoJur:Authenticated'));
  const history = useHistory();

  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoJur:token');
    const name = localStorage.getItem('@GoJur:name');
    const id = localStorage.getItem('@GoJur:userCompanyId');
    const companyId = localStorage.getItem('@GoJur:companyId');
    const userPhoto = localStorage.getItem('@GoJur:Avatar');
    const tpoUser = localStorage.getItem('@GoJur:tpoUser');

    if (token && name && id && companyId && tpoUser) {
      return { token, name, companyId, id, userPhoto, tpoUser };
    }

    return {} as AuthState;
  });


  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('/Usuario/Logar', {
      email,
      password,
    });
  
    if (response.data.companyAccessType === "CS") {
      localStorage.setItem('@GoJur:accessCode', response.data.accessCode);
      localStorage.setItem('@GoJur:token', response.data.token);
      localStorage.setItem('@GoJur:financialInformationCaller', 'login');
      window.open(`/financialInformation`);
    } else {
      const { token, name, companyId, id, userPhoto, tpoUser, accessCode, compayName, periodTest, dateCreation } = response.data;

      localStorage.setItem('@GoJur:companyId', companyId);
      localStorage.setItem('@GoJur:token', token);
      localStorage.setItem('@GoJur:accessCode', accessCode);
      localStorage.setItem('@GoJur:name', name);
      localStorage.setItem('@GoJur:userCompanyId', id);
      localStorage.setItem('@GoJur:Avatar', userPhoto);
      localStorage.setItem('@GoJur:tpoUser', tpoUser);
      localStorage.setItem('@GoJur:companyName', compayName);

      localStorage.setItem('@GoJur:Authenticated', 'S');
    
      setData({ token, name, companyId, id, userPhoto, tpoUser });
    
      // Check if companyAccessType is "TG" and periodTest is greater than 15 days from dateCreation
      // Check if companyAccessType is "TG" and periodTest is past the current date
    // if (response.data.companyAccessType === "TG" && periodTest) {
    //   const periodTestDate = parse(periodTest, 'dd/MM/yyyy', new Date());
    //   const currentDate = new Date();

    //   if (isAfter(currentDate, periodTestDate)) {
    //     window.location.href = `/changeplan`;
    //     return;
    //   }
    // }
   
    }
  }, []);


  const signOut = useCallback(() => {
    localStorage.clear();

    setData({} as AuthState);
  }, []);


  return (
    <AuthContext.Provider
      value={{
        name: data.name,
        companyId: data.companyId,
        userPhoto: data.userPhoto,
        tpoUser: data.tpoUser,
        isAuthenticated: authenticated,

        signIn,
        signOut,
        id: data.id,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth usa como dependencia o AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
