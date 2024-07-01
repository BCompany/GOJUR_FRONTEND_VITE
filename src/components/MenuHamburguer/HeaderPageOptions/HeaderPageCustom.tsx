/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */

import React, { useEffect, useState } from 'react';
import api from 'services/api';
import { envProvider } from 'services/hooks/useEnv';

export const HeaderPageCustom = ( props ) => {
  
  const {handlePaymentSlip} = props.callback;

  const companyId = localStorage.getItem('@GoJur:companyId');

  if (companyId === "1" || companyId === "33" || companyId === "6291"){
    return (
      <>
        <hr />
        <button
          type="button"
          className="menuLink"
          onClick={() => {
            handlePaymentSlip();
          }}
        >
          Carteira de Cobrança
        </button>
      </>
    )
  }
  
  return null;
}