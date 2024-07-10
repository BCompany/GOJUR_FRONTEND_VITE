import styled from 'styled-components';

interface NavigationProps {
  changeOn: boolean;
}

export const Container = styled.div<NavigationProps>`
  width: 18rem;
  height: 2rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 2rem;

  > button {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 4px;
    margin: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;

    > svg {
      width: 1.25rem;
      height: 1.25rem;
      color: var(--blue-light);
    }

    &:hover {
      background-color: transparent;
      > svg {
        color: var(--orange);
      }
    }
  }

  > button#layoutChange {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    > svg {
      width: 1.25rem;
      height: 1.25rem;
      color: var(--blue-light);
    }

    &:hover {
      background-color: transparent;

      > svg {
        color: var(--orange);
      }
    }
  }

  > button#logout {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    > svg {
      width: 1.25rem;
      height: 1.25rem;
      color: var(--blue-light);
    }

    &:hover {
      background-color: transparent;
      > svg {
        color: var(--orange);
      }
    }
  }

  .buttonHamburguer {
    justify-content:end;  
    text-align:center;
    padding-right:1rem;
    padding-top:0.5rem;
    position:relative;
    width:36px;
    margin-left:7px;
    
    >div{
      margin-right:-1rem;
      margin-top:-4.5rem;
      position:absolute;
    }    
    .iconMenu {
      color: var(--blue-light);
      width: 1.25rem;
      height: 1.25rem;

      &:hover {
        color: var(--orange);
        width: 1.25rem;
        height: 1.25rem;
      }
    }
  }
`;


export const IconNotification = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-left: 1rem;
  transition: 0.3s;

  > svg {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--blue-light);

    &:hover {
      color: var(--orange);
    }
  }

  > p {
    font-size: 0.625rem;
    font-weight: 700;
    position: relative;
    right: 0.5rem;
    top: 0.25rem;
    background: var(--white);
    color: var(--orange);
    padding: 0.08rem;
    border-radius: 8px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--blue-light);
  }
`;
