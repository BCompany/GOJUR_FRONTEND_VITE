/* eslint-disable no-param-reassign */
import React from 'react';
import HeaderComponent from 'components/HeaderComponent';
import { FiSave } from 'react-icons/fi'
import { Container, Content, Footer } from './styles';

interface ModalProps {
  close(): void;                                  
  callback(actionSave: string);
}


const ModalBankPaymentSlipOptions: React.FC<ModalProps> = ({close, callback}) => {

  const handleClick = (action: string) => {
    callback(action)
  }


  return (
    <Container id='Container'>

      <HeaderComponent title="Escolha a opção desejada" cursor action={close} />
      
      <Content id='Content'>
        Este movimento está parcelado. Não são gerados boletos para as movimentações anteriores a data atual.
        <br /><br />
        Deseja gerar os boletos também para as outras parcelas ?
      </Content>

      <Footer id='Footer'>
        <button type="submit" className="buttonClick" title="Clique para gerar o boleto para somente este" onClick={() => handleClick("justOne")}>
          <FiSave />
          Somente este
        </button>

        <button type="submit" className="buttonClick" title="Clique para gerar o boleto para todos" onClick={() => handleClick("all")}>
          <FiSave />
          Todos
        </button>

        <button type="submit" className="buttonClick" title="Clique para salvar este e os seguintes" onClick={() => handleClick("thisAndNext")}>
          <FiSave />
          Este e os seguintes
        </button>
      </Footer>

    </Container>
  );
};

export default ModalBankPaymentSlipOptions;
