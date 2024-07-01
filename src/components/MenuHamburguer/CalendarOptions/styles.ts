import styled from 'styled-components';

interface SearchProps {
    show:boolean
  }


  export const MenuHamburger = styled.div`
  flex-direction: column;
  z-index:9999;
  align-items: center;
  padding: 1rem;
  background-color: var(--white-card);
  border-radius: 0.25rem;
  border: 1px solid var(--blue-twitter);
  position: absolute;
  right: 1.4rem;
  top: 7.2rem;
  font-size:0.15rem;
  z-index:9999;

  .menuSection {
    font-size:0.65rem;
    padding: 0.25rem 0.5rem;
    color:var(--blue-twitter);
    text-align:center;
    cursor:pointer;

    > svg {
      width:0.85rem;
      height:0.85rem; 
    }

    &:hover {
      color: var(--orange);
    }
  }

  .menuLink {
    font-size:0.65rem;
  }

  hr {
    border-top: 1px solid red;
    width: 100%;
    border-top: 1px solid var(--gray-outline);
    padding-top: 0.5rem;
    margin-top: 0.5rem;
  }
  button {
    padding: 0.25rem 0.5rem;
    color: var(--secondary);

    &:hover {
      color: var(--orange);
      /* box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.2); */
    }
    & + button {
      margin-top: 0.5rem;
    }
  }
`;

export const MenuHamburgerMobile = styled.div`
  flex-direction: column;
  z-index:9999;
  align-items: center;
  padding: 1rem;
  background-color: var(--white-card);
  border-radius: 0.25rem;
  border: 1px solid var(--blue-twitter);
  position: absolute;
  right: 6rem;
  top: 17rem;
  font-size:0.15rem;
  z-index:9999;

  .menuSection {
    font-size:0.65rem;
    padding: 0.25rem 0.5rem;
    color:var(--blue-twitter);
    text-align:center;
    cursor:pointer;

    > svg {
      width:0.85rem;
      height:0.85rem; 
    }

    &:hover {
      color: var(--orange);
    }
  }

  .menuLink {
    font-size:0.65rem;
  }

  hr {
    border-top: 1px solid red;
    width: 100%;
    border-top: 1px solid var(--gray-outline);
    padding-top: 0.5rem;
    margin-top: 0.5rem;
  }
  button {
    padding: 0.25rem 0.5rem;
    color: var(--secondary);

    &:hover {
      color: var(--orange);
      /* box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.2); */
    }
    & + button {
      margin-top: 0.5rem;
    }
  }
`;

export const ModalConfirm = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size:0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:20rem;
  height:8rem;
  background-color:var(--white);
  position:absolute;
  z-index:9999;
  justify-content:center;
  display: ${props => (props.show ? 'block' : 'none')};
  
  input, select {
      flex: 1;
      font-size: 0.675rem;
      padding: 0.25rem;
      background-color: rgba(255,255,255,0.25);
      width: 99%;
      border-bottom: 1px solid rgba(0,0,0,0.15);
      color: var(--secondary);

      &:focus {
        border-bottom: 1px solid var(--orange);
      }
    }
`;
