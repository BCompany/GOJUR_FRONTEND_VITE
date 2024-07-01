import styled from 'styled-components';

interface headerProps {
  cursorMouse: boolean;
  handleClose: boolean;
}

export const Container = styled.div<headerProps>`
  width: 100%;
  height: 1.2rem;
  background: rgba(0, 0, 0, 0.1);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: 0.3s all;
  /* cursor: ${props => (props.cursorMouse ? 'grabbing' : 'normal')}; */

  > section {
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
  }
`;
