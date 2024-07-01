import React, { AreaHTMLAttributes } from 'react';

import { Container } from './styles';

interface SeparatorProps extends AreaHTMLAttributes<HTMLDivElement> {
  name: string;
}

const Separator: React.FC<SeparatorProps> = ({ ...props }) => {
  return <Container {...props} />;
};

export default Separator;
