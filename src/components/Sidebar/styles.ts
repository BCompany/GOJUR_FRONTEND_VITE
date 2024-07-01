import styled from 'styled-components';

interface ContainerProps {
  isOpenMenu: boolean;
  isBlock?: boolean;
}

interface SearchProps {
  show:boolean
}

export const Container = styled.div<ContainerProps>`
  width: ${props => (props.isOpenMenu ? '7vw' : '100%')};
  max-width: 13vw; 
  height: 100vh;
  background-color: var(--white);
  box-shadow: 1px 4px 4px rgba(63, 63, 191, 0.3);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s;
  z-index: 1;

  > svg {
    width: 1.7rem;
    height: 1.7rem;
    color: var(--primary);
  }

  > img {
    width: 3rem;
    height: 3rem;
  }

  > button#perfil {
    width: ${props => (props.isOpenMenu ? '56px' : '80%')};
    height: 56px;
    text-decoration: none;
    background-color: transparent;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.5s;
    opacity: ${props => (props.isBlock ? 0.5 : 1)};

    &:hover {
      background-color: var(--blue-soft);
    }
    > svg {
      width: 1.7rem;
      height: 1.7rem;
      color: var(--blue);
      margin-left: ${props => (props.isOpenMenu ? '' : '16px')};
    }

    > p {
      display: ${props => (props.isOpenMenu ? 'none' : 'block')};
      flex: 1;
      text-decoration: none;
      font-size: 0.875rem;
      font-family: montserrat;
      margin-left: 1rem;
      text-align: left;
      color: var(--primary);
    }
  }

  > #perfil {
    position: relative;
    top: 2rem;
  }
  > img {
    height: 40px;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
  }
`;

export const Content = styled.div<ContainerProps>`
  width: 100%;
  height: 65vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  transition: all 0.5s;

  > a,
  button#main {
    width: ${props => (props.isOpenMenu ? '5vw' : '13vw')};
    height: 56px;
    text-decoration: none;
    background-color: transparent;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.5s;
    opacity: ${props => (props.isBlock ? 0.5 : 1)};

    &:hover {
      background-color: var(--blue-soft);
    }
    > svg {
      width: 1.8rem;
      height: 1.8rem;
      color: var(--blue);
      margin-left: ${props => (props.isOpenMenu ? '' : '16px')};
    }

    > p {
      display: ${props => (props.isOpenMenu ? 'none' : 'block')};
      flex: 1;
      text-decoration: none;
      font-size: 0.875rem;
      font-family: montserrat;
      margin-left: 1rem;
      text-align: left;

      color: var(--primary);
    }
  }

  > button {
    width: ${props => (props.isOpenMenu ? '56px' : '80%')};
    height: 56px;
    text-decoration: none;
    background-color: transparent;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.5s;

    &:hover {
      background-color: var(--blue-soft);
    }
    > svg {
      width: 1.7rem;
      height: 1.7rem;
      color: var(--grey);
      margin-left: ${props => (props.isOpenMenu ? '' : '16px')};
    }

    > p {
      display: ${props => (props.isOpenMenu ? 'none' : 'flex')};
      flex: 1;
      text-decoration: none;
      font-size: 0.865rem;
      font-family: montserrat;
      margin-left: 1rem;
      color: var(--primary);
    }
  }
`;

export const ModalInformation = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size:0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:38rem;
  height:29rem;
  background-color:var(--white);
  position:absolute;
  z-index:99999;
  justify-content:center;
  margin-left:100%;
  margin-top:5%;
  overlay: {zIndex: 1000}
  display: ${props => (props.show ? 'block' : 'none')};

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

`;

export const ModalImage = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size:0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:40rem;
  height:50rem;
  background-color:var(--white);
  position:absolute;
  z-index:99999;
  justify-content:center;
  margin-left:100%;
  margin-top:5%;
  display: ${props => (props.show ? 'block' : 'none')};
`;
