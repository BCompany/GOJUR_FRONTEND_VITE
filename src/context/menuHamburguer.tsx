import React, { createContext,  useContext, useState, useCallback } from 'react';

interface menuHamburguerData {
  isOpenMenuReport: boolean;
  isOpenMenuParameter: boolean;
  isOpenMenuConfig: boolean;
  isOpenMenuHelp: boolean;
  isOpenMenuSearch: boolean;
  isOpenMenuDealDefaultCategory: boolean;
  isMenuOpen: boolean;
  isOpenOldVersion: boolean;
  caller: string;
  handleIsOpenMenuReport(value:boolean): void;
  handleIsOpenMenuConfig(value:boolean): void;
  handleIsOpenMenuSearch(value:boolean): void;
  handleIsOpenMenuDealDefaultCategory(value:boolean): void;
  handleIsOpenMenuParameter(value:boolean): void;
  handleIsOpenMenuHelp(value:boolean): void;
  handleOpenOldVersion(value:boolean): void;
  handleIsMenuOpen(value:boolean): void;
  handleCaller(value:string): void;
}

const MenuHamburgerContext = createContext<menuHamburguerData>({} as menuHamburguerData);

const MenuHamburguerProvider: React.FC =  ({ children }) => {
  
  const [isOpenMenuReport, setIsOpenMenuReport] = useState(false);
  const [isOpenMenuHelp, setIsOpenMenuHelp] = useState(false);
  const [isOpenMenuSearch, setIsOpenMenuSearch] = useState(false);
  const [isOpenMenuDealDefaultCategory, setIsOpenMenuDealDeafultCategory] = useState(false);
  const [isOpenMenuConfig, setIsOpenMenuConfig] = useState(false);
  const [isOpenOldVersion, setIsOpenOldVersion] = useState(false);
  const [isOpenMenuParameter, setIsOpenMenuParameter] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [caller, setCaller] = useState("");

  const handleIsOpenMenuReport = useCallback((value:boolean) => {
    setIsOpenMenuReport(value)    
  }, []);

  const handleIsOpenMenuConfig = useCallback((value:boolean) => {
    setIsOpenMenuConfig(value)
  }, []);

  const handleIsOpenMenuSearch = useCallback((value:boolean) => {
    setIsOpenMenuSearch(value)
  }, []);

  const handleIsOpenMenuDealDefaultCategory = useCallback((value:boolean) => {
    setIsOpenMenuDealDeafultCategory(value)
  }, []);

  const handleIsOpenMenuHelp = useCallback((value:boolean) => {
    setIsOpenMenuHelp(value)
  }, []);

  const handleIsMenuOpen = useCallback((value:boolean) => {
    setIsMenuOpen(value)
  }, []);

  const handleOpenOldVersion = useCallback((value:boolean) => {
    setIsOpenOldVersion(value)
  }, []);

  const handleCaller = useCallback((value:string) => {
    setCaller(value)    
  }, []);

  const handleIsOpenMenuParameter = useCallback((value:boolean) => {
    setIsOpenMenuParameter(value)    
  }, []);

  return (

    <MenuHamburgerContext.Provider
      value={{
          handleIsOpenMenuReport,
          handleIsOpenMenuConfig,
          handleIsMenuOpen,
          handleCaller,
          handleIsOpenMenuSearch,
          handleIsOpenMenuDealDefaultCategory,
          handleIsOpenMenuHelp,
          handleOpenOldVersion,
          handleIsOpenMenuParameter,
          isOpenMenuReport,
          isMenuOpen,
          isOpenMenuConfig,
          isOpenMenuHelp,
          isOpenMenuSearch,
          isOpenMenuDealDefaultCategory,
          isOpenOldVersion,
          isOpenMenuParameter,
          caller
        }}
    >
      {children}
    </MenuHamburgerContext.Provider>

  );
};

function useMenuHamburguer(): menuHamburguerData {
  const context = useContext(MenuHamburgerContext);

  if (!context) {
    throw new Error('userMenuHamburguer usa como dependencia o ModalProvider');
  }

  return context;
}

export { MenuHamburguerProvider, useMenuHamburguer };