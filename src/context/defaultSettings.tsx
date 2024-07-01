import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from 'react';

import { useLocation } from 'react-router-dom';
import { isMobile } from 'react-device-detect'

interface DefaultsProps {
  id: string;
  value: string;
}

interface ModulesPermission {
  adm: string;
  matter: string;
  publication: string;
  configuration: string;
  calendar: string;
  customer: string;
  financial: string;
  user: string;
}

interface DefaultSettingsContextData {
  handleUserPermission(data: string[]): void;
  permissionData: ModulesPermission;
  permission: string[];
  handleBlockMenu(): void;
  handleUnlockMenu(): void;
  blockMenu: boolean;
  showSlideBar:boolean
}

const DefaultSettingsContext = createContext({} as DefaultSettingsContextData);

const DefaultSettingsProvider: React.FC = ({ children }) => {
  const { pathname } = useLocation();

  // const [modulesAdm, setModulesAdm] = useState<string>('N');
  // const [modulesMatter, setModulesMatter] = useState<string>('N');
  // const [modulesPublication, setModulesPublication] = useState<string>('N');
  // const [modulesConfiguration, setModulesConfiguration] = useState<string>('N');
  // const [modulesCalendar, setModulesCalendar] = useState<string>('N');
  // const [modulesCustomer, setModulesCustomer] = useState<string>('N');
  // const [modulesFinancial, setModulesFinancial] = useState<string>('N');
  // const [modulesUser, setModulesUser] = useState<string>('N');
  const [permissionDto, setPermissionDto] = useState<string[]>([]);
  const [isBlock, setIsBlock] = useState(false);
  const [showToolBar, setShowToolBar] = useState<boolean>(true);
  const [permissionModules, setPermissionModules] = useState({} as ModulesPermission );

  useEffect(() => {
    if (pathname === '/publication') {
      localStorage.setItem('@GoJur:PublicationFilterName', 'filterNameFalse');
    }

    // validate show slidebar according to device or web app 
    // if is device hidden the tool bar to get better the visualiz
    if (pathname === '/publication' && isMobile){
      setShowToolBar(false);
    }else{
      setShowToolBar(true);
    }

  }, [pathname]);

  const handleUserPermission = useCallback(data => {
    const permissions: string[] = data;
    setPermissionDto(permissions);

    setPermissionModules({
      adm: permissions.includes('adm') ? 'S' : 'N',
      calendar: permissions.includes('calendar') ? 'S' : 'N',
      matter: permissions.includes('matter') ? 'S' : 'N',
      configuration: permissions.includes('configuration') ? 'S' : 'N',
      customer: permissions.includes('customer') ? 'S' : 'N',
      financial: permissions.includes('financial') ? 'S' : 'N',
      publication: permissions.includes('publication') ? 'S' : 'N',
      user: permissions.includes('user') ? 'S' : 'N',
    });
  }, []);

  const handleBlockMenu = useCallback(() => {
    setIsBlock(true);
  }, []);
  
  const handleUnlockMenu = useCallback(() => {
    setIsBlock(false);
  }, []);

  return (
    <DefaultSettingsContext.Provider
      value={{
        handleUserPermission,
        permissionData: permissionModules,
        permission: permissionDto,
        handleBlockMenu,
        handleUnlockMenu,
        blockMenu: isBlock,
        showSlideBar: showToolBar
      }}
    >
      {children}
    </DefaultSettingsContext.Provider>
  );
};

function useDefaultSettings(): DefaultSettingsContextData {
  const context = useContext(DefaultSettingsContext);

  if (!context) {
    throw new Error(
      'useDefaultSettings usa como dependencia o DefaultSettingsProvider',
    );
  }

  return context;
}

export { DefaultSettingsProvider, useDefaultSettings };
