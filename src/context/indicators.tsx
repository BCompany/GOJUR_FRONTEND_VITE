import React, { createContext, useCallback, useContext, useState } from 'react';

interface IndicatorsContextData {
  totalPublications: number;
  appointmentIPermission: boolean;
  publicationIPermission: boolean;
  handleTotalPublition(total: number): void;
  handleValidateAppointments(key: string): void;
  handleValidatePublication(key: string): void;
}

// import { Container } from './styles';

const IndicatorsContext = createContext({} as IndicatorsContextData);

const IndicatorProvider: React.FC = ({ children }) => {
  const [totalPublication, setTotalPublication] = useState(0);
  const [
    appointmentIndicatorPermission,
    setAppointmentIndicatorPermission,
  ] = useState(false);
  const [
    publicationIndicatorPermission,
    setPublicationIndicatorPermission,
  ] = useState(false);

  const handleTotalPublition = useCallback(total => {
    setTotalPublication(total);
  }, []);

  const handleValidateAppointments = useCallback(
    key => {
      console.log('k', key);
      //   if (key !== '') {
      //     setAppointmentIndicatorPermission(!appointmentIndicatorPermission);
      //   }
    },
    [appointmentIndicatorPermission],
  );

  const handleValidatePublication = useCallback(
    key => {
      if (key !== '') {
        setPublicationIndicatorPermission(!publicationIndicatorPermission);
      }
    },
    [publicationIndicatorPermission],
  );
  return (
    <IndicatorsContext.Provider
      value={{
        totalPublications: totalPublication,
        appointmentIPermission: appointmentIndicatorPermission,
        publicationIPermission: publicationIndicatorPermission,
        handleTotalPublition,
        handleValidateAppointments,
        handleValidatePublication,
      }}
    >
      {children}
    </IndicatorsContext.Provider>
  );
};

function useIndicators(): IndicatorsContextData {
  const context = useContext(IndicatorsContext);

  if (!context) {
    throw new Error('useIndicators usa como dependencia o IndicatorsProvider');
  }

  return context;
}

export { IndicatorProvider, useIndicators };
