/* eslint-disable no-param-reassign */
import React from 'react';
import HeaderComponent from 'components/HeaderComponent';
import { FiSave } from 'react-icons/fi'
import { Container, Content, Footer } from './styles';

interface ModalProps {
  description: string;                            
  close(): void;                                  
  callback(actionSave: string);
}

const ModalDealOptions: React.FC<ModalProps> = ({close, description, callback}) => {

  const handleClick = (action: string) => {
    callback(action)
  }

  return (
    <Container>
      <HeaderComponent title="Escolha a opção desejada" cursor action={close} />
      
      <Content>
        {description}
      </Content>

      <Footer>
        <button className="buttonClick" type="submit" title="Clique para salvar somente este" onClick={() => handleClick("justOne")}>
          <FiSave />
          Somente esta
        </button>

        <button className="buttonClick" type="submit" title="Clique para salvar este e os seguintes" onClick={() => handleClick("thisAndNext")}>
          <FiSave />
          Esta e as seguintes
        </button>
      </Footer>
    </Container>
  );
};

export default ModalDealOptions;
