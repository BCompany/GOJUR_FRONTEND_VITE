import styled from 'styled-components';

interface headerProps {
  cursorMouse: boolean;
  handleClose: boolean;
}

export const ContainerHeader = styled.div<headerProps>`
  width: 100%;
  height: 1.5rem;
  background: rgba(0, 0, 0, 0.1);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: 0.3s all;

  > div {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

      > p {
        font-family: montserrat;
        font-weight: normal;
        font-size: 0.75rem;
        line-height: 1.2px;
        padding: 20px;
      }

      div{
        display: flex;
      }

      > button {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;

        > svg {
          width: 24px;
          height: 24px;
          color: var(--blue-twitter);
          cursor:pointer;
        }

        &:hover {
          > svg {
            color: var(--orange);
          }
        }
      }
    }

  > div {
    display: ${props => (props.handleClose ? 'flex' : 'none')};
    align-items: center;
    justify-content: center;

    > svg {
      width: 1.5rem;
      height: 1.5rem;
      color: var(--grey);
      border-radius: 4px;
      margin-right: 0.5rem;

      &:hover {
        color: var(--orange);
        background-color: var(--white);
      }
    }
  }`;

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--white);
`;

export const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
`;
