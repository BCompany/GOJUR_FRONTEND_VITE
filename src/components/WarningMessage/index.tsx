import React from 'react';
import { ContentMessage } from './styles';

const WarnningMessage: React.FC = (props) => {

  return (

    <ContentMessage>

      {props.children}

    </ContentMessage>
  )
  
}
 
export default WarnningMessage;