import React from 'react';
import { ToggleWrapper } from './styles';

interface ToggleSwitchProps {
  toggle: boolean;
  onClick: () => void;
  label?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ onClick, toggle, label }) => {
  return (
    <ToggleWrapper onClick={onClick} active={toggle} title={label}>
      <div className="track">
        <div className="thumb" />
      </div>
      {label && <span className="label">{label}</span>}
    </ToggleWrapper>
  );
};
