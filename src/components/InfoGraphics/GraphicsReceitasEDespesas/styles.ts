import styled from 'styled-components';

interface headerProps {
  cursorMouse: boolean;
  handleClose: boolean;
}

export const ContainerHeader = styled.div<headerProps>`
  width: 100%;
  height: 2rem;
  background: #eef4fb;
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: 0.3s all;
  border-bottom: 1px solid rgba(44, 142, 214, 0.12);

  > div {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

      > p {
        font-family: Montserrat;
        font-weight: 500;
        font-size: 0.72rem;
        line-height: 1.2;
        color: var(--blue-twitter);
        padding: 0 0.5rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
