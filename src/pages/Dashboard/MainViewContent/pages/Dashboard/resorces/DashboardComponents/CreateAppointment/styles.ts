import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { MultiSelect } from 'react-multi-select-component';

interface ModalProps {
  visible: boolean;
}

interface DragProps {
  isDrag: boolean;
}

interface WrapperProps {
  isPublic: boolean;
}

interface LogProps {
  isOpen: boolean;
}

interface DetailsProps {
  details: boolean;
}

interface FooterProps {
  showButtons: boolean;
}

interface SearchProps {
  show: boolean;
}

export const DropArea = styled(motion.div)<ModalProps>`
  width: 100vw;
  height: 100vh;
  z-index: 9999;

  background: rgba(0, 0, 0, 0.5);
  position: absolute;

  display: ${props => (props.visible ? 'block' : 'none')};
`;

export const Container2 = styled.form`
  background-color: var(--white);
  max-height: 92vh;
  max-width: 102vh;
  z-index: 1;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.45);
  transform: translateX(50%);

  ::-webkit-scrollbar {
    width: 0.225rem;
  }

  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background: var(--orange);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.125);
  }
`;

export const Container = styled.form`
  background-color: var(--white);

  max-height: 92vh;
  z-index: 1;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.45);
  transform: translateX(50%);

  ::-webkit-scrollbar {
    width: 0.225rem;
  }

  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background: var(--orange);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.125);
  }
`;

export const ModalContent = styled.form<DragProps>`
  flex: 1;
  background-color: transparent;
  padding: 0.25rem 1rem;
  display: flex;
  flex-direction: column;
  max-height: 95vh;
  overflow: auto;

  .autoComplete {
    font-size: 0.75rem;
    margin: 0.3rem;
    margin-left: -5px;
    margin-bottom: 10px;

    .css-yk16xz-control {
      background-color: transparent;
    }
  }

  ::-webkit-scrollbar {
    width: 0.225rem;
  }

  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background: var(--orange);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.125);
  }
`;

export const ModalDateSettings = styled.div`
  background-color: transparent;
  /* width: calc(100% - 1rem); */
  display: flex;

  /* border: 1.5px solid black; */

  > div {
    /* display: flex; */
    align-items: center;
    justify-content: space-between;

    > input#allday {
      width: 0.8rem;
      height: 0.8rem;
      margin-right: 4px;
    }

    > svg {
      width: 0.9rem;
      height: 0.9rem;
      color: var(--blue);

      &:hover {
        color: var(--orange);
        cursor: pointer;
      }
    }
  }
`;

export const Process = styled.div`
  /* border: 1.5px solid black; */
  width: calc(100% - 1rem);
  background: transparent;
  padding-top: 0.5rem;
  padding-bottom: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  transition: all 0.5s;
  > label {
    font-size: 0.75rem;
    font-weight: 400;
    padding-right: 0.25rem;
    margin-right: 1rem;
  }

  > a {
    width: 100%;
    max-width: 560px;

    text-decoration: none;
    text-align: center;
    font-size: 0.75rem;
    color: var(--secondary);
    border-bottom: 1px solid var(--grey);
    /* border: 1px solid black; */

    display: flex;
    align-items: center;
    justify-content: space-between;

    > p {
      flex: 1;
    }

    @media (min-width: 1366px) {
      max-width: 858px;
    }
    @media (max-width: 1366px) {
      max-width: 560px;
    }

    &:hover {
      border-color: var(--orange);
      color: var(--orange);
    }
  }
  > button#associar {
    width: 100%;
    max-width: 560px;

    text-decoration: none;
    text-align: center;
    font-size: 0.75rem;
    color: var(--secondary);
    border-bottom: 1px solid var(--grey);
    /* border: 1px solid black; */

    display: flex;
    align-items: center;
    justify-content: space-between;

    > p {
      flex: 1;
    }

    @media (min-width: 1366px) {
      max-width: 858px;
    }
    @media (max-width: 1366px) {
      max-width: 560px;
    }

    &:hover {
      border-color: var(--orange);
      color: var(--orange);
    }
  }

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    > svg {
      width: 24px;
      height: 24px;
      color: var(--grey);
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);

      > svg {
        opacity: 1;
        color: var(--orange);
      }
    }
  }
`;

export const Wrapper = styled.div<WrapperProps>`
  width: calc(100% - 1rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--grey);

  > section {
    flex: 1;
    height: 1rem;
    display: flex;
    align-items: center;
  }
  ::-webkit-scrollbar {
    width: 0.225rem;
  }

  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background: var(--orange);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.125);
  }
`;

export const Lembrete = styled.div`
  flex: 1;
  height: 5.5rem;
  display: flex;
  flex-direction: column;
  overflow: auto;

  margin-bottom: 0.25rem;

  > div#content {
    /* border: 1px solid black; */
    margin: 0.25rem 0.25rem 0.25rem 0rem;

    display: flex;
    align-items: center;

    > label {
      font-size: 0.75rem;
    }

    > select {
      flex: 1;
      max-width: 198px;
      height: 2rem;
      border-bottom: 1px solid var(--grey);
      margin-left: 1.5rem;
      font-size: 0.765rem;
      /* margin-right: 0.5rem; */
      color: var(--grey);
      font-size: 0.765rem;

      @media (min-width: 1366px) {
        max-width: 100%;
        margin-right: 1rem;
      }

      &:hover {
        border-bottom: 2px solid var(--grey);
      }
    }
  }
`;

export const ReminderList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  margin-right: 0.75rem;
  padding-right: 0.75rem;
  margin-left: 0.5rem;

  > div {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    > p {
      width: 50%;
      font-size: 0.65rem;
    }

    > button {
      display: flex;
      align-items: center;
      justify-content: center;
      > svg {
        width: 15px;
        height: 15px;
        color: var(--grey);
        margin-right: 0.25rem;

        &:hover {
          color: var(--orange);
        }
      }
    }

    > input {
      width: 16px;
      height: 16px;
    }
  }

  ::-webkit-scrollbar {
    width: 0.225rem;
  }

  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background: var(--orange);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.125);
  }
`;

export const Privacidade = styled.div<WrapperProps>`
  flex: 1;
  height: 5.5rem;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  /* border: 1px solid black; */

  > div {
    flex: 1;
    height: 2rem;

    display: flex;
    align-items: center;
    justify-content: center;
    > label {
      font-size: 0.75rem;
      margin-right: 0.5rem;
    }

    > select {
      flex: 1;

      height: 2rem;
      border-bottom: 1px solid var(--grey);
      margin-left: 16px;
      color: var(--grey);
      font-size: 0.765rem;
      @media (min-width: 1366px) {
        width: 100%;
        max-width: 360px;
      }

      &:hover {
        border-bottom: 2px solid var(--grey);
      }
    }
  }

  > section {
    flex: 1;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    > div {
      display: ${props => (props.isPublic ? 'flex' : 'none')};

      > p {
        font-size: 0.625rem;
        margin-left: 0.5rem;
      }
    }
  }
`;

export const WrapperResp = styled.div<WrapperProps>`
  display: flex;
  align-items: stretch;
  height: auto;
  justify-content: space-between;
  width: calc(100% - 1rem);
  /* border-bottom: 1px solid var(--grey); */

  > section {
    flex: 1;
    height: 3rem;
    display: flex;
    align-items: center;
  }
  ::-webkit-scrollbar {
    width: 0.225rem;
  }

  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background: var(--orange);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.125);
  }
`;

export const Responsavel = styled.div`
  flex: 1;
  height: auto;
  min-height: 5rem;
  display: flex;
  flex-direction: column;
  /* overflow: hidden; */
  /* overflow: hidden; */
  /* border: 1px solid black; */
  > div {
    /* border: 1px solid black; */
    height: 2rem;
    display: flex;
    /* background-color:black; */
    align-items: center;
    > label {
      font-size: 0.75rem;
    }
    > input {
      width: 100%;
      max-width: 198px;
      height: 2rem;
      border-bottom: 1px solid var(--grey);
      margin-left: 8px;
      color: var(--grey);
      font-size: 0.765rem;
      @media (min-width: 1366px) {
        flex: 1;
        max-width: 100%;
        margin-right: 1rem;
      }
      &:hover {
        border-bottom: 2px solid var(--grey);
      }
    }
  }

  .users {
    font-size: 0.75rem;
    margin: 0.3rem;
    margin-bottom: 10px;

    .userListSelect {
      width: 20rem;
    }

    .css-yk16xz-control {
      margin-left: 10px;
      width: 20rem;
      background-color: transparent;
    }
  }
`;

export const ResponsibleList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  /* overflow: auto; */
  margin-right: 0.75rem;
  padding-right: 0.75rem;
  margin-left: 0.5rem;
  /* overflow: hidden; */

  > div {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    > div {
      text-align: center;
      width: 100%;
      font-size: 0.65rem;
    }

    > button {
      display: flex;
      align-items: center;
      justify-content: center;
      > svg {
        width: 15px;
        height: 15px;
        color: var(--grey);
        margin-right: 0.25rem;

        &:hover {
          color: var(--orange);
        }
      }
    }

    > input {
      width: 16px;
      height: 16px;
    }
  }

  ::-webkit-scrollbar {
    width: 0.225rem;
  }

  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background: var(--orange);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.125);
  }
`;

export const Share = styled.div<WrapperProps>`
  flex: 1;
  height: auto;
  min-height: 5rem;
  display: flex;
  flex-direction: column;

  opacity: ${props =>
    props.isPublic ? '0.4' : '1'}; /* border: 1px solid black; */
  > div {
    /* border: 1px solid black; */
    height: 2rem;
    display: flex;
    align-items: center;

    > label {
      font-size: 0.675rem;
    }

    > input {
      width: 100%;
      max-width: 198px;

      height: 2rem;
      border-bottom: 1px solid var(--grey);
      margin-left: 8px;
      color: var(--grey);
      font-size: 0.765rem;

      @media (min-width: 1366px) {
        flex: 1;
        max-width: 100%;
        margin-right: 1rem;
      }

      &:hover {
        border-bottom: 2px solid var(--grey);
      }
    }
  }
`;

export const ShareList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  margin-right: 0.75rem;
  padding-right: 0.75rem;
  margin-left: 0.5rem;

  > div {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    > div {
      text-align: center;
      width: 100%;
      font-size: 0.65rem;
    }

    > button {
      display: flex;
      align-items: center;
      justify-content: center;
      > svg {
        width: 15px;
        height: 15px;
        color: var(--grey);
        margin-right: 0.25rem;

        &:hover {
          color: var(--orange);
        }
      }
    }

    > input {
      width: 16px;
      height: 16px;
    }
  }

  ::-webkit-scrollbar {
    width: 0.225rem;
  }

  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background: var(--orange);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.125);
  }
`;

export const Footer = styled.div<FooterProps>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid var(--grey);
  /* border: 1px solid black; */

  > section {
    padding: 0.5rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    /* border: 1px solid black; */

    > button {
      display: ${props => (props.showButtons ? 'flex' : 'none')};
      margin-bottom: 0.5rem;

      &:hover {
        color: var(--orange);
        > svg {
          color: var(--orange);
        }
      }
      > p {
        font-size: 0.625rem;
      }

      > svg {
        width: 16px;
        height: 16px;
        color: var(--blue);
        margin-right: 0.5rem;
      }
    }

    > p {
      font-size: 0.75rem;
      font-family: montserrat;
    }
  }

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 5px;
    > button {
      width: 4rem;
      height: 2rem;
      font-size: 0.75rem;
      font-weight: 500;
      font-family: Montserrat;
      margin-bottom: 0.5rem;
      margin-left: 0.5rem;
      margin-right: 0.5rem;
      background-color: var(--blue-twitter);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.25rem;
      box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2);
      color: var(--white);

      &:hover {
        background-color: var(--blue);
      }
    }

    > button#done {
      display: ${props => (props.showButtons ? 'flex' : 'none')};
    }
    > button#delete {
      display: ${props => (props.showButtons ? 'flex' : 'none')};
    }
  }
`;

export const ModalRecurrence = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size: 0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0, 0, 0, 0.15);
  width: 22rem;
  min-height: 21rem;
  height: auto;
  background-color: var(--white);
  position: absolute;
  z-index: 9999;
  justify-content: center;
  margin-left: 35%;
  margin-top: 10%;
  display: ${props => (props.show ? 'block' : 'none')};

  .dropdown {
    flex: 1;
    font-size: 0.675rem;
    padding: 0.25rem;
    background-color: rgba(255, 255, 255, 0.25);
    width: 99%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    color: var(--secondary);

    &:focus {
      border-bottom: 1px solid var(--orange);
    }
  }

  .textInput {
    flex: 1;
    font-size: 0.675rem;
    padding: 0.25rem;
    background-color: rgba(255, 255, 255, 0.25);
    width: 99%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    color: var(--secondary);

    &:focus {
      border-bottom: 1px solid var(--orange);
    }
  }

  footer {
    display: flex;
    justify-content: center;
  }
`;

export const Multi = styled(MultiSelect)`
  width: 16rem;
  font-size: 0.6rem;
  background-color: var(--white);
  color: var(--primary);
  float: left;
  &::placeholder {
    color: var(--primary);
  }

  &:focus {
    border: none;
  }
`;

export const ConfirmOverlay = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99998;

  /* text inside overlay */
  > div {
    background: var(--white-card);
    height: 3rem;
    color: var(--blue-twitter);
    font-size: 0.765rem;
    text-align: center;
    padding: 1rem;
    margin-left: 30vw;
    margin-right: 25vw;
    margin-top: 20%;
    border-radius: 0.25rem;
    box-shadow: 1px 1px 4px 0.5px rgba(0, 0, 0, 0.15);
  }
`;

export const ModalConfirm = styled.div<SearchProps>`
  width: 35rem;
  height: 12rem;
  background-color: #fff;
  z-index: 99999;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  border: 1px solid var(--blue-twitter);
  font-size: 0.765rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0, 0, 0, 0.15);
  position: absolute;
  justify-content: center;
  margin-left: 28%;
  margin-top: 20%;
  display: ${props => (props.show ? 'block' : 'none')};

  > header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 0.5rem;
    padding-top: 0.25rem;
    background-color: rgba(0, 0, 0, 0.1);
    color: var(--orange);
    font-size: 0.775rem;
    > button {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      > svg {
        width: 24px;
        height: 24px;
        color: var(--secondary);
      }

      &:hover {
        > svg {
          color: var(--orange);
        }
      }
    }
  }

  footer {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    width: 100%;

    button {
      padding: 0.5rem 2rem;
      color: var(--white);
      border-radius: 0.25rem;
      margin: 0 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        color: var(--white);
        width: 1.25rem;
        height: 1.25rem;
        margin-right: 0.5rem;
      }

      &:hover {
        filter: brightness(75%);
        font-size: 0.65rem;
      }

      &.accept {
        background-color: var(--green);
        font-size: 0.65rem;
      }

      &.cancel {
        background-color: var(--red);
        font-size: 0.65rem;
      }
    }
  }
`;
