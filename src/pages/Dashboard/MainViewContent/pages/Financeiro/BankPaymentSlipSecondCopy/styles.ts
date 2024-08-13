import styled from 'styled-components';

export const ModalBankPaymentSlipSecond = styled.div`
  border: 1px solid var(--blue-twitter);
  font-size: 0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width: 28rem;
  height: 25rem;
  background-color: #EDEDED;
  position: absolute;
  z-index: 2;
  justify-content: center;
  margin-left: 25%;
  margin-top: 5%;

  .menuSection {
    font-size:0.65rem;
    padding: 0.25rem 0.5rem;
    color:var(--blue-twitter);
    text-align:right;
    cursor:pointer;

    > svg {
      width:0.85rem;
      height:0.85rem; 
    }

    &:hover {
      color: var(--orange);
    }
  }

  input, select {
    flex: 1;
    font-size: 0.675rem;
    padding: 0.25rem;
    background-color: white;
    width: 99%;
    border-bottom: 1px solid rgba(0,0,0,0.15);
    color: var(--secondary);

    &:focus {
      border-bottom: 1px solid var(--orange);
    }
  }
  
`;