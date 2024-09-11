import React, { createContext, useCallback, useContext, useState } from 'react';

interface HeaderContextData {
  listOpen: boolean;
  handleShowListSearch: (state: boolean) => void;
  handleDragOn: (state: boolean) => void;
  handleCaptureNewImage: (image: any) => void;
  handleCaptureText: (term: string) => void;
  handleCaptureType: (term: string) => void;
  handleDispathCallback: (state: boolean) => void;
  handleLoadingData: (state: boolean) => void;
  handleFilterList: (value:string) => void;
  handleReleaseDrag: (state: boolean) => void;
  dragOn: boolean;
  LoadingData:boolean;
  imageT: any;
  captureText: string;
  captureType: string;
  dispathCallback: boolean;
  filterList:string;
  releaseDrag: boolean;
}

const HeaderContext = createContext({} as HeaderContextData);

const HeaderProvider: React.FC = ({children}) => {
 
  const [listOpen , setListOpen] = useState(false);
  const [dragOn , setDragOn] = useState(false);
  const [LoadingData , setLoadingData] = useState(false);
  const [imageT , setImageT] = useState<any>(null);
  const [captureText , setCaptureText] = useState<string>('');
  const [captureType , setCaptureType] = useState<string>('');    
  const [filterList , setFilterList] = useState<string>('');    
  const [dispathCallback , setDispathCallback] = useState<boolean>(false);
  const [releaseDrag, setReleaseDrag] = useState<boolean>(false);
  
  const handleShowListSearch = useCallback((state: boolean) => {
    setListOpen(state)
    },[]);

  const handleDragOn = useCallback((state: boolean) => {
    setDragOn(state)
  },[]);
 
  const handleCaptureNewImage = useCallback((image: any) => {
    setImageT(image)
  },[]); 

  const handleLoadingData = useCallback((value: boolean) => {
    setLoadingData(value)
  },[]); 

  const handleCaptureText = useCallback((text: string) => {
    setCaptureText(text)
  },[])

  const handleCaptureType = useCallback((text: string) => {
    setCaptureType(text)
  },[])

  const handleDispathCallback = useCallback((state: boolean) => {
    setDispathCallback(state)
  },[])

  const handleFilterList = useCallback((value: string) => {
    setFilterList(value)
  },[])

  const handleReleaseDrag = useCallback((state: boolean) => {
    setReleaseDrag(state)
  },[]);

  return (
    <HeaderContext.Provider
      value={{        
        handleShowListSearch, 
        handleDragOn ,
        handleCaptureNewImage,
        handleCaptureText,
        handleCaptureType,
        handleDispathCallback,
        handleFilterList,
        handleLoadingData,
        handleReleaseDrag,
        listOpen,
        dragOn,
        imageT,
        captureText,
        captureType,
        dispathCallback,
        filterList,
        LoadingData,
        releaseDrag
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

function useHeader(): HeaderContextData {
  const context = useContext(HeaderContext);

  if (!context) {
    throw new Error('useHeader usa como dependencia o IndicatorsProvider');
  }

  return context;
}

export { HeaderProvider, useHeader };

