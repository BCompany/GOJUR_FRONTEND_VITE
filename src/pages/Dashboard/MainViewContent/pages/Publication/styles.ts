import styled from 'styled-components';
import { MultiSelect } from 'react-multi-select-component';

interface MenuProps {
  open: boolean;
}

interface PublicationProps {
  isRead: boolean;
}

export const Container = styled.div`
  /* flex:  1;*/
  height: 100vh;
  width: 92vw;

  display: flex;
  flex-direction: column;
  padding-bottom: 1rem;
  overflow: auto;
`;

export const User = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 0.5rem;

  > img {
    width: 40px;
    height: 40px;
    border-radius: 16px;
    border: 1px solid var(--blue-twitter);
  }
  > p {
    margin-left: 0.5rem;
    font-size: 0.75rem;
    font-family: Montserrat;
    color: var(--orange);
  }
`;

export const Filter = styled.div`
  flex: 1;
  width: 90vw;
  display: flex;
  flex-direction: column;
  max-height: 6.5rem;
  margin-top: 1rem;
  padding: 0.5rem 0.5rem;

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      /* background-color: var(--blue); */
      position: relative;
      padding: 0 0.5rem;
      > svg {
        width: 2rem;
        height: 2rem;
        color: var(--blue);
      }

      &:hover {
        > svg {
          color: var(--orange);
        }
      }
    }

    .tipMesssage {
      cursor: pointer;
    }

    .buttonCheckBox {
      padding: 0.4rem;
      border-radius: 0.25rem;
      font-family: Montserrat;
      font-size: 0.585rem;
      background-color: var(--blue);
      transition-duration: 0.4s;
      border-radius: 10px;
      color: var(--gray);
      display: flex;
      align-items: center;

      > svg {
        width: 0.8rem;
        height: 1rem;
        color: var(--white);
        margin-right: 0.5rem;
      }

      &:hover {
        filter: brightness(80%);
      }
    }

    > section {
      /* flex: 1; */
      height: 2rem;
    }
    > section#week {
      width: 16rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-right: 5px;

      > button {
        border: 1px solid var(--secondary);
        font-family: Montserrat;
        font-weight: 500;
        font-size: 0.675rem;
        color: var(--primary);
        background-color: var(--white);
        padding: 0.15rem;

        &:hover {
          color: var(--blue);
        }
      }
    }

    > section#filters {
      flex: 1;
      display: flex;
      position: relative;
      align-items: center;
      justify-content: space-around;

      > select {
        width: 11.7rem;
        margin-right: 5px;
        /* margin-left:5px; */
        height: 1.8rem;
        border: 1px solid var(--secondary);
        background-color: var(--white);
        /* padding: 0 0.5rem; */
        border-radius: 4px;
        color: var(--primary);

        &:focus {
          border: 1px solid var(--blue);
        }

        option {
          color: var(--secondary);
        }
      }
    }
  }

  > article {
    /* margin: 0.5rem 0;     */
    align-items: center;
    z-index: 0;

    > h1 {
      margin-bottom: 0.25rem;
      color: var(--primary);
      font-weight: 500;
      font-size: 0.6rem;

      font-family: Montserrat;

      b {
        font-size: 0.75rem;
        font-weight: 600;
        font-family: Poppins;
      }
    }

    > p {
      font-size: 0.75rem;
      font-weight: 600;
      margin-top: 10px;
      font-family: Poppins;
      color: var(--secondary);
    }
  }
`;

export const Wrapper = styled.div`
  flex: 1;
  /* padding: 0rem 4rem; */
  padding: 0.5rem 0.5rem;

  /* overflow: auto; */
  /* background-color:blue;
  width:27%; */

  > div#footer {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    > button {
      width: 280px;
      height: 2rem;
      color: var(--white);
      margin: 1rem 0;
    }
  }

  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background: var(--orange);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  }
`;

export const PublicationItem = styled.div`
  height: auto;
  border-radius: 10px;
  background-color: var(--white-card);
  box-shadow: 1px 4px 4px 1px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  & + div {
    margin-top: 1rem;
  }

  > header {
    background-color: rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    padding: 0.15rem 0.15rem;
    border-radius: 10px 10px 0px 0px;

    > input {
      margin-right: 0.5rem;
    }

    > article {
      flex: 1;
      display: flex;

      > p {
        font-size: 0.725rem;
        color: var(--primary);
        margin: 0 1rem;
      }

      > svg {
        margin-left: 5px;
        width: 1rem;
        height: 1rem;
        color: var(--black);
      }
    }

    > p {
      flex: 1;
      max-width: 280px;
      font-size: 0.725rem;

      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  > div {
    flex: 1;
    display: flex;
  }
`;

export const MatterEventItem = styled.div`
  height: auto;
  border-radius: 10px;
  background-color: var(--white-card);
  box-shadow: 1px 4px 4px 1px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  & + div {
    margin-top: 1rem;
  }

  > header {
    background-color: rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    padding: 0.15rem 0.15rem;
    border-radius: 10px 10px 0px 0px;
    color: #ffffff;

    > input {
      margin-right: 0.5rem;
    }

    > article {
      flex: 1;
      display: flex;

      > p {
        font-size: 0.725rem;
        color: #ffffff;
        margin: 0 1rem;
      }

      > svg {
        margin-left: 5px;
        width: 1rem;
        height: 1rem;
        color: var(--black);
      }
    }

    > p {
      flex: 1;
      max-width: 280px;
      font-size: 0.725rem;

      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  > div {
    flex: 1;
    display: flex;
  }
`;

export const ContentItem = styled.div<PublicationProps>`
  flex: 1;
  height: auto;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  > div {
    display: flex;

    > p {
      font-size: 0.775rem;
      color: var(--secondary);
      margin-left: 0.5rem;
    }
    > p#title {
      font-size: 0.775rem;
      color: var(--primary);
      font-weight: 500;
      margin-left: 0;
    }
  }

  > p {
    font-size: 0.775rem;
    color: var(--secondary);
    text-align: justify;
    padding-right: 0.5rem;
    overflow: auto;
    opacity: ${props => (props.isRead ? 0.5 : 1)};
    font-weight: ${props => (props.isRead ? 300 : 600)};

    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-thumb {
      -webkit-border-radius: 0.5rem;
      border-radius: 0.5rem;
      background: var(--orange);
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
    }
  }

  .titleResponsible {
    float: left;
    font-weight: 500;
    font-size: 0.775rem;
  }

  .contentResponsible {
    font-size: 0.775rem;
  }
`;
export const ContentLegalResume = styled.div`
  border: 0.5px solid #E0E0E0;
  border-radius: 8px;
  padding: 0.5rem;
  flex-direction: column;
  margin-top: 1rem;
  background-color: #fff;
  
  color: #333;

  .title {
    font-size: 0.775rem;
    font-weight: 600;
    margin: 0rem 0 0.5rem;
    color: #444;
    margin-top: 0.5rem;
  }

  .resumo {
    font-size: 0.775rem;
    line-height: 1.5;
    color: #555;
  }

  .partes {
    font-size: 0.775rem;
    color: #444;

    > div {
      margin: 0.205rem 0;
    }

    strong {
      font-weight: 600;
      margin-right: 0.25rem;
      margin-left: 0.5rem;
    }
  }

  .prazos {
    display: flex;    
    flex-direction: column;
    gap: 0.4rem;
    font-size: 0.775rem;
    color: #444;
    margin-top: 0.5rem;

    > div {
      display: flex;

      > p {
        > svg {
            margin-right: 0.25rem;
            width: 0.765rem;
            height: 0.765rem;;
            color: var(--blue);
            cursor: pointer;
          }
          font-weight: 600;
          color: var(--blue);
          text-decoration: none;
          transition: color 0.2s ease;
          cursor: pointer;
          margin-right: 0.5rem;
          min-width: 100px;
          

          &:hover {
            color: #0d47a1;
            text-decoration: underline;
          }
      }
    }
  }

  // .prazoLink {
  //   > svg {
  //     margin-right: 0.25rem;
  //     width: 0.765rem;
  //     height: 0.765rem;;
  //     color: var(--blue);
  //     cursor: pointer;
  //   }
  //   font-weight: 600;
  //   color: var(--blue);
  //   text-decoration: none;
  //   transition: color 0.2s ease;
  //   cursor: pointer;

  //   &:hover {
  //     color: #0d47a1;
  //     text-decoration: underline;
  //   }
  // }
`;


export const ContentItemMatterEvent = styled.div<PublicationProps>`
  flex: 1;
  height: auto;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;

  > div {
    display: flex;

    > p {
      font-size: 0.775rem;
      color: var(--secondary);
      margin-left: 0.5rem;
    }
    > p#title {
      font-size: 0.775rem;
      color: var(--primary);
      font-weight: 500;
      margin-left: 0;
    }
  }

  > p {
    font-size: 0.775rem;
    color: var(--secondary);
    text-align: justify;
    padding-right: 0.5rem;
    overflow: auto;
    opacity: ${props => (props.isRead ? 0.5 : 1)};
    font-weight: ${props => (props.isRead ? 300 : 600)};

    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-thumb {
      -webkit-border-radius: 0.5rem;
      border-radius: 0.5rem;
      background: var(--orange);
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
    }
  }

  .titleResponsible {
    float: left;
    font-weight: 500;
    font-size: 0.775rem;
  }

  .contentResponsible {
    font-size: 0.775rem;
  }
`;

export const EventList = styled.div`
  font-size: 0.55rem;

  > p a {
    color: var(--orange);
    text-decoration: none;
    cursor: pointer;

    &:hover {
      color: var(--blue);
    }
  }

  > .emptyMessage {
    color: var(--orange);
    text-align: center;
    margin-top: 0.5rem;
    font-size: 0.55rem;
  }
`;

export const MenuItem = styled.div<MenuProps>`
  width: ${props => (props.open ? '17%' : '3%')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0.5rem 0.5rem;
  transition: all 0.5s;

  @media (max-width: 480px) {
    width: ${props => (props.open ? '40%' : '3%')};
  }

  > button {
    flex: 1;
    background-color: transparent;

    > svg {
      width: 1.5rem;
      height: 1.5rem;
      color: var(--blue);
    }

    &:hover {
      svg {
        color: var(--orange);
      }
    }
  }

  > div {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* justify-content: center; */
    border-left: 1px solid var(--blue);
    > section {
      margin-bottom: 0.5rem;
      margin-right: 3px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      > button {
        flex: 1;

        > svg {
          width: 1.5rem;
          height: 1.5rem;
          color: var(--blue);
        }

        &:hover {
          svg {
            color: var(--orange);
          }
        }
      }

      > p {
        width: 100%;
        padding-left: 1.5rem;
        text-align: left;
        justify-content: center;
        margin-top: 0.15rem;
        color: var(--blue-twitter);
        min-height: 1.3rem;
        cursor: pointer;
        font-size: 0.63rem;
        font-weight: 300;

        &:hover {
          color: var(--orange);
        }

        svg {
          width: 0.8rem;
          height: 0.8rem;
          margin-right: 5px;
          color: var(--blue);
          cursor: pointer;

          &:hover {
            color: var(--orange);
            background-color: rgba(0, 0, 0, 0.015);
          }
        }
      }
    }

    > article {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 0 0.5rem;

      > p {
        font-size: 0.765rem;
        color: var(--orange);
      }
      > p#subject {
        flex: 1;
        text-align: left;
        margin-left: 0.5rem;
        color: var(--secondary);
        font-size: 0.625rem;
      }

      &:hover {
        > p {
          text-decoration: underline;
        }
      }
    }
  }
`;

export const Multi = styled(MultiSelect)`
  font-size: 0.7rem;
  background-color: var(--white);
  color: var(--primary);
  margin-right: 5px;

  .dropdown-heading {
    min-width: 13vw;
    height: 1.6rem;
  }

  svg:first-child {
    margin-left: 40px;
    width: 21px;
    height: 20px;
    margin-top: -25px;
    position: absolute;
  }

  &::placeholder {
    color: var(--primary);
  }

  &:focus {
    border: none;
  }
`;

export const Menu = styled.div`
  width: 220px;
  height: 180px;
  background-color: var(--white);
  /* position: absolute; */
  margin-left: auto;
  margin-left: 75vw;
  /* top: 116px;
  left: 180px; */
  border: 1px solid var(--secondary);
  padding: 0.5rem 0.25rem;
  border-radius: 10px;

  display: flex;
  flex-direction: column;
  justify-content: space-around;

  > button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-radius: 6px;
    > svg {
      /* margin-right: 0.5rem; */
      margin-left: 0.5rem;
      color: var(--blue-twitter);
      width: 20px;
      height: 20px;
    }

    > p {
      flex: 1;
      font-family: Montserrat;
      font-size: 0.625rem;
      color: var(--primary);
    }

    &:hover {
      background-color: var(--blue-light);

      > p {
        color: var(--white);
      }
    }
  }

  > a {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-radius: 6px;

    text-decoration: none;
    > svg {
      margin-left: 0.5rem;
      color: var(--blue-twitter);
      width: 20px;
      height: 20px;
    }

    > p {
      flex: 1;
      font-family: Montserrat;
      font-size: 0.625rem;
      text-align: center;
      color: var(--primary);
    }

    &:hover {
      background-color: var(--blue-light);

      > p {
        color: var(--white);
      }
    }
  }
`;
