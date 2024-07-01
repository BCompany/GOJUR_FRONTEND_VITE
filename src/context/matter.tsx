import React, { createContext, useContext, useState } from 'react'

interface MatterContextData {
  isOpenCardBox: boolean;
  matterReferenceId: number;
  handleOpenCardBox (value: boolean): void;
  handleMatterReferenceId (value: number): void;
}

const MatterContext = createContext<MatterContextData>({} as MatterContextData);

const MatterProvider: React.FC = ({ children }) => {

  const [isOpenCardBox, setIsOpenCardBox] = useState<boolean>(false);
  const [matterReferenceId, setMatterReferenceId] = useState<number>(0);

  const handleOpenCardBox = (value: boolean): void => {
    console.log(value)
    setIsOpenCardBox(value);
  }

  const handleMatterReferenceId = (value: number): void => {
    setMatterReferenceId(value);
  }

  return ( 
    <MatterContext.Provider
      value={{
        isOpenCardBox,
        matterReferenceId,
        handleOpenCardBox,
        handleMatterReferenceId
      }}
    >
      {children}
    </MatterContext.Provider>
  )
}

function useMatter(): MatterContextData {
  const context = useContext(MatterContext);

  if (!context){
    throw new Error('nao foi possível carregar o context useMatter')
  }
  
  return context
}

export { MatterProvider, useMatter };