import styled from 'styled-components';

interface PublitionProps {
  visible: boolean;
  styles: boolean;
}

interface AlertCardProps {
  onHover: boolean;
}

interface headerProps {
  cursorMouse: boolean;
  handleClose: boolean;
}

export const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: var(--white);

  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const PublicationContent = styled.div`
  width: 100%;
  height: 100%;
  background-color: transparent;
  /* border: 1px solid #999591; */
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;

  ::-webkit-scrollbar {
    width: 0.25rem;
  }

  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background: var(--orange);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.4);
  }

  > button {
    margin-top: 16px;
    background: var(--orange);
    padding: 16px;
    border-radius: 6px;
    color: var(--gray);
    font-size: 0.75rem;
    text-decoration: none;
    margin-bottom: 1rem;

    &:hover {
      opacity: 0.85;
      color: var(--secondary);
    }
  }

  > section {
    display: flex;
    flex-direction: column;
    align-items: center;

    > p {
      text-align: center;
      font-size: 0.875rem;
    }

    > button {
      margin-top: 16px;
      background: var(--orange);
      padding: 16px;
      border-radius: 6px;
      color: var(--gray);
      font-size: 0.75rem;
      text-decoration: none;

      &:hover {
        opacity: 0.85;
        color: var(--secondary);
      }
    }
  }

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 0.25rem;
    margin-bottom: 1rem;

    > h2 {
      font-family: Poppins;
      font-weight: normal;
      font-size: 0.875rem;
      color: var(--secondary);
    }

    > p {
      font-family: Poppins;
      font-weight: normal;
      font-size: 11px;
      color: var(--orange);
      margin-top: 0.25rem;
    }
  }
`;

export const AlertBox = styled.div`
  width: 90%;
  height: auto;
  max-height: 220px;
  border-radius: 8px;
  background: #fafafa;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > header {
    font-size: 20px;
    font-family: poppins;
    font-weight: 300;
    color: var(--orange);
  }

  > div {
    width: 100%;
    height: 100%;
    /* border: 1px solid #000; */
    overflow: auto;

    padding: 0.5rem;

    ::-webkit-scrollbar {
      width: 0.25rem;
    }

    ::-webkit-scrollbar-thumb {
      -webkit-border-radius: 0.5rem;
      border-radius: 0.5rem;
      background: var(--orange);
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.4);
    }
  }
`;
export const AlertCard = styled.div<AlertCardProps>`
  width: 100%;
  height: 3.5rem;
  background: #fafafa;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.35);
  border-radius: 4px;
  padding: 0.25rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s;
  overflow: hidden;
  cursor: pointer;

  > h4 {
    width: 100%;
    height: 100%;
    display: none;
    align-items: center;
    justify-content: center;
    font-family: Montserrat;
    text-align: center;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--blue);
    background-color: #e1f5fe;
  }

  > img {
    /* border: 1px solid #000; */
    width: 64px;
    height: 64px;
    border-radius: 50%;
  }

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    overflow: hidden;

    padding: 0.25rem;

    > h5 {
      font-family: Montserrat;
      font-size: 0.65rem;
      font-weight: 700;
      color: var(--primary);
      margin-top: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      > svg {
        width: 16px;
        height: 16px;
        color: var(--orange);
        margin-left: 0.5rem;
      }
    }

    > section {
      display: flex;

      width: 100%;
      height: 2rem;

      margin-top: 0.5rem;

      p {
        width: 100%;
        font-size: 0.65rem;
        font-weight: normal;
        font-family: Poppins;
        color: var(--secondary);

        text-align: center;
      }
    }
  }

  &:hover {
    /* background-color: var(--blue-light); */
    background-color: #e3f2fd;
    opacity: 0.8;
    cursor: pointer;

    > div {
      > h5 {
        > svg {
          color: var(--orange);
        }
      }
    }
  }
`;

export const PublicationBox = styled.div`
  width: 90%;
  height: 100%;
  border-radius: 8px;
  background: #fafafa;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > header {
    font-size: 20px;
    font-family: poppins;
    font-weight: 300;
    color: var(--blue-twitter);
  }

  > div {
    width: 100%;
    height: 100%;
    /* border: 1px solid #000; */
    overflow: auto;

    padding: 0.5rem;

    ::-webkit-scrollbar {
      width: 0.25rem;
    }

    ::-webkit-scrollbar-thumb {
      -webkit-border-radius: 0.5rem;
      border-radius: 0.5rem;
      background: var(--orange);
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.4);
    }
  }

  > button {
    margin-bottom:10px;
    //margin-top: 16px;
    /* background: var(--orange);
    padding: 16px;
    border-radius: 6px;
    color: var(--gray);
    font-size: 0.75rem;
    text-decoration: none;
    margin-bottom: 1rem;

    &:hover {
      opacity: 0.85;
      color: var(--secondary);
    } */
  }
`;

export const PublicationCard = styled.div<PublitionProps>`
  width: 100%;
  height: 8rem;
  background-color: ${props => (props.styles ? '#e1f5fe' : '#ffffcc')};
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.35);
  border-radius: 4px;
  padding: 0.25rem;
  margin-bottom: 0.5rem;
  display: flex;
  cursor: pointer;

  transition: all 0.5s;
  opacity: ${props => (props.visible ? 0.4 : 1)};

  &:hover {
    background: ${props => (props.styles ? '#4fc3f7' : '#fafa84')};
  }

  > div {
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-around;
    > article {
      display: flex;
      align-items: center;
      justify-content: space-between;
      > p {
        font-size: 0.75rem;
        font-family: Montserrat;
        color: var(--primary);
      }

      > svg {
        width: 20px;
        height: 20px;
        color: var(--orange);
      }
    }

    > div {
      display: flex;
      align-items: center;

      p {
        font-size: 0.65rem;
        font-family: Montserrat;
        color: var(--secondary);

        & + p {
          margin-left: 0.5rem;
        }
      }
    }
    > section {
      width: 100%;
      display: flex;
      overflow: hidden;

      img {
        width: 48px;
        height: 48px;
        border: 2px solid var(--white);
        margin-top: 0.5rem;
        border-radius: 50%;
        & + img {
          margin-left: -24px;
        }
      }

      > article {
        flex: 1;
        height: 3.5rem;
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
        font-size: 0.75rem;
        font-family: Montserrat;
        text-align: center;

        overflow: hidden;
        > p {
          font-size: 0.625rem;
          /* margin-top: 0.25rem; */
          text-align: justify;
          text-overflow: ellipsis;
          color: var(--secondary);
        }
      }
    }
  }
`;

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
