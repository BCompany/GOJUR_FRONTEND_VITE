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
  width:250px;

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

  .subMenuSection {
    font-size:0.65rem;
    padding: 0.25rem 0.5rem;
    color:var(--blue-twitter);
    text-align:center;
    cursor:pointer;

    > svg {
      width:1rem;
      height:1rem; 
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


export const DealCategoryModal = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size: 0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width: 55rem;
  height: 28rem;
  overflow: auto;
  background-color: var(--white);
  position: absolute;
  z-index: 99998;
  justify-content: center;
  margin-left: -58rem;
  margin-top: 10rem;

  .categoria {
    width: 80%;
    margin-left: 10%;
  }

  input, select {
    flex: 1;
    font-size: 0.675rem;
    padding: 0.25rem;
    background-color: #FFFFFF;
    width: 99%;
    border-bottom: 1px solid rgba(0,0,0,0.15);
    color: var(--secondary);

    &:focus {
    border-bottom: 1px solid var(--orange);
    }
  }

  .menuTitle {
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.25rem 0.5rem;
    color: black;
    text-align: center;
    float: left;
    width: 92.99%;
    background-color: #dcdcdc;
    height: 27px;
  }

  .menuSection {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
    color: var(--blue-twitter);
    text-align: right;
    cursor: pointer;
    float: left;
    width: 7.003%;
    background-color: #dcdcdc;
    height: 27px;

    > svg {
      width: 0.85rem;
      height: 0.85rem;
      stroke-width: 3px;
    }

    &:hover {
      color: var(--orange);
    }
  }
`;


export const OverlayConfirm = styled.div `
    background-color: rgba(0, 0, 0, 0.4);
    top: 0;
    left: 0;
    margin-left: -100rem;
    width: 600vh;
    height: 200vh;
    z-index: 99997;
`;


export const OverlaySave = styled.div `
    background-color: rgba(0, 0, 0, 0.4);
    top: 0;
    left: 0;
    margin-left: -100rem;
    width: 600vh;
    height: 200vh;
    z-index: 99999;
`;
