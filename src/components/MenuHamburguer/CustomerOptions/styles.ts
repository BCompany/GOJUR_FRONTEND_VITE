import styled from 'styled-components';


export const MenuHamburger = styled.div`
    flex-direction: column;
    z-index:9999;
    align-items: center;
    padding: 1rem;
    background-color: var(--white-card);
    border-radius: 0.25rem;
    border: 1px solid var(--blue-twitter);
    position: absolute;
    right: 2rem;
    top: 6rem;
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
