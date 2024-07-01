import React, { InputHTMLAttributes, useCallback } from 'react';
import { CEP_Mask, CPF_Mask, TEL_Mask,CNPJ_Mask, CNJ_Mask, CostCenterMask, CNPJCPF_Mask } from './masks';
import "./styles.css"

interface inputProps extends InputHTMLAttributes<HTMLInputElement>{
  mask: 'cep' | 'cpf' | 'tel' | 'cnpj' | 'cnj' | 'costCenter' | 'cpfcnpj';
}

const InputMask: React.FC<inputProps> = ({  mask, ...props }) => {

  const handleKeyUp = useCallback((e:React.FormEvent<HTMLInputElement>) =>{

    if (mask === 'cep'){
      CEP_Mask(e);
    }
    
    if (mask === 'cpf'){
      CPF_Mask(e);
    }
      
    if (mask === 'cnpj'){
      CNPJ_Mask(e);
    }

    if (mask === 'tel'){
      TEL_Mask(e);
    }

    if (mask === 'cnj'){
      CNJ_Mask(e);
    }

    if (mask === 'costCenter'){
      CostCenterMask(e);
    }

    if (mask === "cpfcnpj"){
      CNPJCPF_Mask(e);
    }

  },[])
    
  return (
    <div>     
      <input {...props} onKeyUp={handleKeyUp} className='input' />
    </div>  
  );
  
};

export default InputMask;
