import React from 'react';
import { ModalProvider } from 'context/modal';
import { IndicatorProvider } from 'context/indicators';
import { PublicationProvider } from 'context/publication';
import { ConfirmProvider } from 'context/confirmBox';
import { AlertProvider } from 'context/alert';
import { DocumentProvider } from 'context/document';
import { MatterProvider } from 'context/matter';
import { MenuHamburguerProvider } from 'context/menuHamburguer';
import Routes from '../routes';
import { Container } from './styles';

const MainViewContent: React.FC = () => {
  return (
    <ModalProvider>
      <DocumentProvider>
        <ConfirmProvider>
          <AlertProvider>
            <PublicationProvider>
              <MatterProvider>
                <IndicatorProvider>
                  <MenuHamburguerProvider>
                    <Container>
                      <Routes />
                    </Container>
                  </MenuHamburguerProvider>
                </IndicatorProvider>
              </MatterProvider>
            </PublicationProvider>
          </AlertProvider>
        </ConfirmProvider>
      </DocumentProvider>
    </ModalProvider>
  );
};

export default MainViewContent;
