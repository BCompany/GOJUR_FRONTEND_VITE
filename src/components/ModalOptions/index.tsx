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

const ModalOptions: React.FC<ModalProps> = ({close, description, callback}) => {

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
        
        <button
          className="buttonClick"
          onClick={() => handleClick("justOne")}
          title="Clique para salvar somente este"
          type="submit"
        >
          <FiSave />
          Somente este
        </button>

        <button
          className="buttonClick"
          onClick={() => handleClick("all")}
          title="Clique para salvar todos"
          type="submit"
        >
          <FiSave />
          Todos
        </button>

        <button
          className="buttonClick"
          onClick={() => handleClick("thisAndNext")}
          title="Clique para salvar este e os seguintes"
          type="submit"
        >
          <FiSave />
          Este e os seguintes
        </button>

      </Footer>

    </Container>
  );
};

export default ModalOptions;
