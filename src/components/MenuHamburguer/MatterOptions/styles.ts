import styled from 'styled-components';


export const Container = styled.div`
    position: relative;
    height: 13.5rem;
    margin-top: -3.8rem;
`;

export const WarningModal = styled.div`
  border: 1px solid var(--blue-twitter);
  font-size:0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:20rem;
  height:12rem;
  padding:2rem;
  background-color:var(--white);
  position:absolute;
  margin-left:-50rem;
  z-index:99999;
  justify-content:center;
  top:50%;

  h2 {
    font-size:1rem;
    margin-bottom:1rem;
  }

  div {
    font-size:0.75rem;
    text-align:center;
  }

  footer {
    margin:1rem;
    display:flex;
    justify-content:center;
  }
`;


export const MenuHamburger = styled.div`
    flex-direction: column;
    z-index:9999;
    align-items: center;
    padding: 1rem;
    background-color: var(--white-card);
    border-radius: 0.25rem;
    border: 1px solid var(--blue-twitter);
    position: absolute;
    right: 1rem;
    top: 6.4rem;
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
      width: 10rem;
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
