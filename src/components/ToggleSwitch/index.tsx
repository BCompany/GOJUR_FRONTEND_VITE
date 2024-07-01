import React from 'react'
import { ToggleSwitcWrapper } from './styles';

export const ToggleSwitch = ({onClick, toggle}) => {
    return (
      <ToggleSwitcWrapper onClick={onClick}>
        <div className={`toggle-btn ${!toggle?"change":""}`}>{toggle ? "Anual" : "Mensal"}</div>
      </ToggleSwitcWrapper>
    )
}