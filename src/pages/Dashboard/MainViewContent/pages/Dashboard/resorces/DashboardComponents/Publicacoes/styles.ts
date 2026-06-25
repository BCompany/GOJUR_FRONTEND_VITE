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
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
  margin-top: 10px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > header {
    width: 100%;
    font-size: 0.8rem;
    font-family: poppins;
    font-weight: 500;
    color: var(--orange);
    padding: 0.4rem 0.75rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  }

  > div {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 0.5rem 0.75rem;

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
  min-height: 4rem;
  height: auto;
  background: #fafafa;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.10);
  border-radius: 4px;
  border-left: 3px solid var(--orange);
  padding: 0.6rem 0.75rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: all 0.3s;
  overflow: hidden;
  cursor: pointer;
  position: relative;

  > h4 {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Montserrat;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--blue-twitter);
    background-color: rgba(225, 245, 254, 0.92);
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.25s;
  }

  > img {
    width: 64px;
    height: 64px;
    border-radius: 50%;
  }

  > div {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
    padding: 0 0.25rem;
    overflow: hidden;

    > h5 {
      font-family: Montserrat;
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--primary);
      display: flex;
      align-items: center;
      gap: 0.4rem;

      > svg {
        width: 14px;
        height: 14px;
        color: var(--orange);
        flex-shrink: 0;
      }
    }

    > section {
      width: 100%;

      p {
        font-size: 0.7rem;
        font-weight: normal;
        font-family: Poppins;
        color: var(--secondary);
        line-height: 1.4;
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  &:hover {
    background-color: #f0f7ff;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);

    > h4 {
      opacity: 1;
    }
  }
`;

export const PublicationBox = styled.div`
  width: 90%;
  height: 100%;
  border-radius: 8px;
  background: #fafafa;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
  margin-top: 12px;
  margin-bottom: 10px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > header {
    width: 100%;
    font-size: 0.8rem;
    font-family: poppins;
    font-weight: 500;
    color: var(--blue-twitter);
    padding: 0.4rem 0.75rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  }

  > div {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 0.5rem 0.75rem;

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
    margin-bottom: 10px;
  }
`;

export const PublicationCard = styled.div<PublitionProps>`
  width: 100%;
  min-height: 8rem;
  height: auto;
  background-color: var(--white-card);
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.10);
  border-radius: 4px;
  border-left: 3px solid ${props => (props.styles ? 'var(--blue-twitter)' : '#c49a00')};
  padding: 0;
  margin-bottom: 0.5rem;
  display: flex;
  overflow: hidden;
  cursor: pointer;

  transition: all 0.3s;
  opacity: ${props => (props.visible ? 0.45 : 1)};

  &:hover {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);

    > div > article {
      background: ${props => (props.styles ? '#ddeeff' : '#fef08a')};
    }
  }

  > div {
    width: 100%;
    display: flex;
    flex-direction: column;

    > article {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.4rem 0.75rem;
      background: ${props => (props.styles ? '#eaf4ff' : '#ffffcc')};
      border-bottom: 1px solid ${props => (props.styles ? 'rgba(44,142,214,0.15)' : 'rgba(196,154,0,0.2)')};
      transition: background 0.3s;

      > p {
        font-size: 0.72rem;
        font-family: Montserrat;
        font-weight: 400;
        color: var(--secondary);

        > b {
          font-weight: 700;
          color: ${props => (props.styles ? 'var(--blue-twitter)' : '#c49a00')};
        }
      }

      > svg {
        width: 18px;
        height: 18px;
        color: var(--orange);
      }
    }

    > div {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.35rem 0.75rem;

      p {
        font-size: 0.68rem;
        font-family: Montserrat;
        color: var(--grey);
      }
    }

    > section {
      width: 100%;
      display: flex;
      overflow: hidden;
      padding: 0 0.75rem 0.5rem;

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
        height: auto;
        display: flex;
        flex-direction: column;
        font-family: Montserrat;
        overflow: hidden;

        > p {
          font-size: 0.7rem;
          line-height: 1.45;
          text-align: left;
          color: var(--secondary);
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
    }
  }
`;

export const ContainerHeader = styled.div<headerProps>`
  width: 100%;
  height: 1.5rem;
  background: #eef4fb;
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
        line-height: 1.2;
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
