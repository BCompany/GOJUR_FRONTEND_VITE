/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */

import React from 'react';
import { ICustomerData, ICustomInfos } from '../Interfaces/ICustomerList';
import PlanInformation from '../Custom/BCO_ID1/PlanInformation'

export const CustomerCustomInformation = ( props ) => {
  
  // params passed by list customer 
  const customer = props.customer as ICustomerData
  const customObject = props.customObject as ICustomInfos[]  
  const companyId = (props.customer as ICustomerData).cod_Empresa
  
  let customInformation: any;
  
  if (customObject){
    customInformation = customObject.find(custom => custom.customerIdCustom === customer.cod_Cliente)
  }

  // Customization for BCO_ID1 - Bcompany
  if (companyId == 1) {

    // return customer information plan 
    return (
      <>
        <PlanInformation customItem={customInformation} />
      </>
    )
  }

  // test - customizations for another company
  if (companyId == 2) {
    
    return null
  }

  // test - customizations for another company
  if (companyId == 3) {
    return null
  }

  // when has no customization return null
  return null;

}

export const CustomerCustomButtons = (props) => {
  // params passed by list customer 
  const customer = props.customer as ICustomerData
  const customObject = props.customObject as ICustomInfos[]  
  const companyId = (props.customer as ICustomerData).cod_Empresa
  
  let customInformation: any;
  
  if (customObject){
    customInformation = customObject.find(custom => custom.customerIdCustom === customer.cod_Cliente)
  }

  if (companyId == 1) {

    // return customer information buttons config
    return (
      <>
        <PlanInformation
          customItem={customInformation}
          headerButtons
          customer={customer}
        />
      </>
    )
  }

  return null;
}