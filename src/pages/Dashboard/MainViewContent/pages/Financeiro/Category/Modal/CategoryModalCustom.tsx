/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */

import React, { useState } from 'react';
import { FcAbout } from 'react-icons/fc';
import { Flags } from './styles';

export const CategoryModalCustom = ( props ) => {

  const {handleFlgInvoiceDefault, flgInvoiceDefault} = props.callback;
  
  const companyId = localStorage.getItem('@GoJur:companyId');

  if (companyId === "1" || companyId === "33" || companyId === "6291"){
    return (
      <>
        <div style={{float:'left', marginLeft: '0px', width: '70px'}}>
          <Flags>
            Fatura 
          </Flags>
        </div>
        
        <div style={{float:'left', marginTop:'3px', width: '55px'}}>
          <input
            type="checkbox"
            name="select"
            checked={flgInvoiceDefault}
            onChange={() => handleFlgInvoiceDefault()}
            style={{minWidth:'15px', minHeight:'15px'}}
          />
        </div>

        <div style={{float:'left', marginTop: '0px'}}>
          <FcAbout 
            className='icons' 
            title='Marque esta opção caso queira que esta categoria seja tratada como padrão no módulo de faturamentoo'
            style={{minWidth: '20px', minHeight: '20px'}}
          /> 
        </div>
      </>
    )
  }
  
  return null;
}