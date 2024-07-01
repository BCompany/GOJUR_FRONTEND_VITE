import React, { useCallback } from 'react';
import { BiCopyAlt } from 'react-icons/bi'
import {MdBlock} from 'react-icons/md';
import { useToast } from 'context/toast';
import { FaWhatsapp } from 'react-icons/fa';
import { useConfirmBox } from 'context/confirmBox';
import { ICustomerContactInfo, IMatterData } from '../Interfaces/IMatter';

interface ICustomerInfo {
  matter:IMatterData;
  customerInfo: ICustomerContactInfo
}

const CustomerInfo: React.FC<ICustomerInfo> = (props) => {

  const {matter} = props;
  const {customerInfo} = props;    
  const { addToast } = useToast();
  const { handleCancelMessage,handleCaller } = useConfirmBox();
  
  const handleCopyClipBoard = (e, text) => {    
    
    const ta = document.createElement("textarea");
    ta.innerText = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();

    addToast({
      type: 'success',
      title: 'Operação realizada com sucesso',
      description: `O conteúdo foi copiado para a área de transferência`,
    });

    e.stopPropagation();
  }

  const handleOpenWhatsApp = useCallback((e, number) => {
    if (number === null) return;
      const message = 'Olá,'
      window.open(`https://web.whatsapp.com/send?phone=+55${number}&text=${message}`, '_blank')    
      
      e.stopPropagation();
      e.preventDefault();
  },[])

  const handleCloseModal = () => {

    handleCaller('matterCustomerInfo')
    handleCancelMessage(true)
  }

  return (
          
    <div className='customerContact'>

      <div>
        <span>Nome</span>
        <span>{customerInfo.nom_Pessoa}</span>
        <BiCopyAlt 
          onClick={(e) => handleCopyClipBoard(e, customerInfo.nom_Pessoa)}
          title='Clique para copiar o conteúdo do campo Nome'
        />
      </div>

      {customerInfo.des_Email && (
        <div>
          <span>Email</span>
          <span>{customerInfo.des_Email}</span>
          <BiCopyAlt 
            onClick={(e) => handleCopyClipBoard(e, customerInfo.des_Email)}
            title='Clique para copiar o conteúdo do campo Email'
          />
        </div>
      )}

      {customerInfo.num_Documento && (
        <div>
          <span>CPF/CNPJ</span>
          <span>{customerInfo.num_Documento}</span>
          <BiCopyAlt 
            onClick={(e) => handleCopyClipBoard(e, customerInfo.num_Documento)}
            title='Clique para copiar o conteúdo do campo CPF/CNPJ'
          />
        </div>
      )}

      {customerInfo.num_Telefone01 && (
        <div>
          <span>Fone</span>
          <span>{customerInfo.num_Telefone01}</span>
          <BiCopyAlt 
            onClick={(e) => handleCopyClipBoard(e, customerInfo.num_Telefone01)}
            title='Clique para copiar o conteúdo do campo Telefone'
          />
        </div>
      )}

      {customerInfo.num_Telefone02 && (
        <div>
          <span>Fone</span>
          <span>{customerInfo.num_Telefone02}</span>
          <BiCopyAlt 
            onClick={(e) => handleCopyClipBoard(e, customerInfo.num_Telefone02)}
            title='Clique para copiar o conteúdo do campo Telefone'
          />
        </div>
      )}

      {customerInfo.num_WhatsApp && (
        <div>
          <span>WhatsApp</span>
          <span>{customerInfo.num_WhatsApp}</span>
          <BiCopyAlt 
            onClick={(e) => handleCopyClipBoard(e, customerInfo.num_WhatsApp)}
            title='Clique para copiar o conteúdo do campo Whatsapp'
          />
          <FaWhatsapp onClick={(e) => handleOpenWhatsApp(e, customerInfo.num_WhatsApp)} style={{color:'var(--green)'}} />
        </div>
      )}

      <button 
        className="buttonLinkClick" 
        title="Clique para fechar as informações de contato do cliente"
        onClick={handleCloseModal}
        type="submit"
      >
        <MdBlock />
        Fechar                
      </button>

    </div>

  )
}

export default  CustomerInfo;