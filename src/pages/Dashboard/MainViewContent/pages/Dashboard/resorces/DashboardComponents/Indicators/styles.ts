import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 6rem;

  display: flex;
  align-items: center;
  justify-content: space-evenly;

  transition: all 0.3s;
`;

export const Content = styled.div`
  width: 10rem;
  height: 5rem;
  background: var(--white);
  border: 1px solid #000;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.3);

  cursor: pointer;

  > a {
    font-family: Montserrat;
    font-size: 0.75rem;
    color: var(--secondary);
    text-align: center;
    text-decoration: none;

    > p {
      font-family: Montserrat;
      font-size: 0.75rem;
      color: var(--secondary);
      text-align: center;
    }

    > h1 {
      font-family: Montserrat;
      font-size: 1.125rem;
      margin-top: 0.25rem;
      color: var(--orange);
    }
  }
  > button {
    font-family: Montserrat;
    font-size: 0.75rem;
    color: var(--secondary);
    text-align: center;
    text-decoration: none;

    > p {
      font-family: Montserrat;
      font-size: 0.75rem;
      color: var(--secondary);
      text-align: center;
    }

    > h1 {
      font-family: Montserrat;
      font-size: 1.125rem;
      margin-top: 0.25rem;
      color: var(--orange);
    }
  }
`;

export const ListItem = styled.a`
  display: flex;
  margin-bottom: 0.5rem;
  overflow: hidden;
  background-color: var(--white);
  border: 0.5px solid rgba(0, 0, 0, 0.8);
  text-decoration: none;
  color: var(--primary);

  &:hover {
    border: 0.5px solid var(--orange);
    box-shadow: 2px 2px 4px 2px rgba(180, 50, 0, 0.3);
    cursor: pointer;
  }

  > article {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-decoration: none;

    > p#date {
      font-size: 0.75rem;

      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0.5rem;
      text-decoration: none;

      > svg {
        width: 1.25rem;
        height: 1.25rem;
        margin-right: 0.5rem;
        color: var(--orange);
      }
    }
    > p#info {
      font-size: 0.875rem;
      font-family: Montserrat;
      margin: 0.5rem;
      text-decoration: none;
    }
  }
`;
