import React from 'react';
import CalendarListOptionsMenu from './CalendarOptions';
import CustomerListOptionsMenu from './CustomerOptions';
import MatterListOptionsMenu from './MatterOptions';
import PublicationOptionsMenu from './publicationOptions';
import HeaderPageOptionsMenu from './HeaderPageOptions';
import FinanceOptionsMenu from './FinanceOptions';
import BillingInvoiceOptionsMenu from './FinanceOptions/BillingInvoiceOptions';

const MenuHamburguer = (props) => {
  //alert(props.name);
  if (props.name === 'customerOptions'){
    return <CustomerListOptionsMenu />
  }

  if (props.name === 'matterOptions'){
    return <MatterListOptionsMenu />
  }
  
  if (props.name === 'calendarOptions'){
    return <CalendarListOptionsMenu />
  }

  if (props.name === 'publicationOptions'){
    return <PublicationOptionsMenu props={props} />
  }

  if (props.name === 'headerPageOptions'){
    return <HeaderPageOptionsMenu />
  }
  
  if (props.name === 'financeOptions'){
    return <FinanceOptionsMenu />
  }

  if (props.name === 'BillingInvoice'){
    return <BillingInvoiceOptionsMenu />
  }


  return <p>Menu ainda não implementado</p>;

}

export default MenuHamburguer