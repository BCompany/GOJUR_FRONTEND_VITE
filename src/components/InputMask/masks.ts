import React from 'react';

// Cep Mask
export function CEP_Mask(e:React.FormEvent<HTMLInputElement>){
  e.currentTarget.maxLength = 9;
    
  let {value} = e.currentTarget;

  value = value.replace(/\D/g, '')
  value = value.replace(/^(\d{5})(\d)/, '$1-$2')
  
  e.currentTarget.value = value;

  return e;
}

export function TEL_Mask(e: React.FormEvent<HTMLInputElement>) {
  e.currentTarget.maxLength = 15;

  let {value} = e.currentTarget;

  value = value.replace(/\D/g,"");                      // Remove tudo o que não é dígito
  value = value.replace(/^(\d\d)(\d)/g,"($1) $2");      // Coloca parênteses em volta dos dois primeiros dígitos
  if(value.length < 14) value = value.replace(/(\d{5})(\d)/,"$1-$2");// Número com 8 dígitos. Formato: (99) 9999-9999
  else value = value.replace(/(\d{5})(\d)/,"$1-$2");    // Número com 9 dígitos. Formato: (99) 99999-9999
  
  e.currentTarget.value = value;
  
  return e
}

export function CNPJ_Mask(e: React.FormEvent<HTMLInputElement>) {
  e.currentTarget.maxLength = 18;
    
  let {value} = e.currentTarget;

  value = value.replace(/\D+/g, '')
  value = value.replace(/(\d{2})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1/$2')
  value = value.replace(/(\d{4})(\d)/, '$1-$2')
  value = value.replace(/(-\d{2})\d+?$/, '$1')        // Coloca um hífen depois do bloco de quatro dígitos

  e.currentTarget.value = value;

  return e
}

export function CPF_Mask(e: React.FormEvent<HTMLInputElement>) {
  e.currentTarget.maxLength = 14;
    
  let {value} = e.currentTarget;

  value = value.replace(/\D+/g, '')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d{1,2})/, '$1-$2')
  value = value.replace(/(-\d{2})\d+?$/, '$1')
  
  e.currentTarget.value = value;
  
  return e
}

export function CNJ_Mask(e: React.FormEvent<HTMLInputElement>) {
  e.currentTarget.maxLength = 25;
    
  let {value} = e.currentTarget;

  console.log(value)

  // 0010134-41.2014.5.15.0103
  value = value.replace(/\D+/g, '')
  value = value.replace(/([0-9]{7})([0-9]{2})([0-9]{4})([0-9]{1})([0-9]{2})([0-9]{4})/, '$1-$2.$3.$4.$5.$6')
  
  
  e.currentTarget.value = value;
  
  return e
}

export function CNPJCPF_Mask(e: React.FormEvent<HTMLInputElement>) {
  e.currentTarget.maxLength = 18;
    
  let {value} = e.currentTarget;

  console.log(value)

  value = value.replace(/\D/g, "")

  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, "$1.$2")
    value = value.replace(/(\d{3})(\d)/, "$1.$2")
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  } else {
    value = value.replace(/^(\d{2})(\d)/, "$1.$2")
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    value = value.replace(/\.(\d{3})(\d)/, ".$1/$2")
    value = value.replace(/(\d{4})(\d)/, "$1-$2")
  }

  e.currentTarget.value = value;
   
  return e
}

export function CostCenterMask(e: React.FormEvent<HTMLInputElement>) {
  e.currentTarget.maxLength = 6;
    
  let {value} = e.currentTarget;

  value = value.replace(/\D+/g, '')
  value = value.replace(/(\d{2})(\d)/, '$1.$2')

  
  e.currentTarget.value = value;
  
  return e
}
