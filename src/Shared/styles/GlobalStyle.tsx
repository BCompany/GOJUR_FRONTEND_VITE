import { MultiSelect } from 'react-multi-select-component';
import styled, { createGlobalStyle } from 'styled-components';

interface AppProps {
  widht: number | undefined;
}

export default createGlobalStyle<AppProps>`
// Base Patterns
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: none;
  }

  html, body, #root {
    max-width: 100vw;
    max-height: 100vh;
    overflow: hidden;

    /* overflow-x:visible;
    overflow-y:hidden; */

    font-family: poppins, montserrat, sans-serif;
    -webkit-font-smoothing: antialiased ;
    font-size: 1.2rem;
    background: var(--white);

    @media (max-width: 420px) {
      font-size: 0.765rem;
    }
  }
  *, button, input {

    // Used when is screen view
    // when media is print for instance, doesn't show borders
    @media screen{
      border: 0;
    }

    outline: none;
    background: transparent;
    font-family: poppins, montserrat, sans-serif;
  }
  html {
    background: var(--blue);
  }

  button {
    cursor: pointer;
  }

  [disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }

  // Colors
  :root {
    --primary: #131513;
    --secondary: #303633;
    --search: #202327;
    --white: #f7f7f8;
    --white-card: #fafafa;
    --grey: #7d7d7d;
    --gray: #edf0f7;
    --gray-outline: #d0e7fd;
    --green: #23be63;
    --green-dark: #1c964e;
    --orange: #ff9000;
    --blue: #0077c0;
    --blue-light: #72a6ef;
    --blue-soft: #d0e7fd;
    --blue-twitter: #2C8ED6;
    --blue-hover-light: #e3f2fd;
    --blue-link: #0645AD ;
    --red: #f44336 ;
    --yellow:#FFFFCC;
    --screenW: ${props => props.widht};

    // Full Calendar
    --fc-small-font-size: 0.6rem;
    --fc-page-bg-color: #fff;
    --fc-neutral-bg-color: #72a6ef
    --fc-neutral-text-color: #808080;
    --fc-border-color: #ddd;

    --fc-button-text-color: #fff;
    --fc-button-bg-color: #2C8ED6;
    --fc-button-border-color:  #2C8ED6;
    --fc-button-hover-bg-color:  #72a6ef;
    --fc-button-hover-border-color: #72a6ef;
    --fc-button-active-bg-color:#77cddb;
    --fc-button-active-border-color:#2C8ED6;
    --fc-button-today-bg-color:#c5e700;

/*
    --fc-event-bg-color: #3788d8;
    --fc-event-border-color: #3788d8;
    --fc-event-text-color: #fff;
    --fc-event-selected-overlay-color: rgba(0, 0, 0, 0.25);

    --fc-more-link-bg-color: #d0d0d0;
    --fc-more-link-text-color: inherit;

    --fc-event-resizer-thickness: 8px;
    --fc-event-resizer-dot-total-width: 8px;
    --fc-event-resizer-dot-border-width: 1px;

    --fc-non-business-color: rgba(215, 215, 215, 0.3);
    --fc-bg-event-color: rgb(143, 223, 130);
    --fc-bg-event-opacity: 0.3;
    --fc-highlight-color: rgba(188, 232, 241, 0.3);
    --fc-today-bg-color: rgba(255, 220, 40, 0.15);
    --fc-now-indicator-color: red; */

  }

  .rmsc {
  --rmsc-main: #4285f4;
  --rmsc-hover: #f1f3f5;
  --rmsc-selected: #f1f3f5;
  --rmsc-border: #303633;
  --rmsc-gray: #7d7d7d;
  --rmsc-bg: #fff;
  --rmsc-p: 10px; /* Spacing */
  --rmsc-radius: 4px; /* Radius */
  --rmsc-h: 38px; /* Height */
}

//Button pattern to be used in all GOJUR App
//Example buttons: Save, Delete, Cancel, Include
//Sidney 08/2021
.buttonClick {
    margin-right: 0.85rem;
    padding: 0.5rem;
    background-color: var(--blue-twitter);
    font-size: 0.625rem;
    color: var(--white);
    cursor:pointer;
    font-family: montserrat;
    border-radius: 0.25rem;
    justify-content: center;
    min-width:5.5rem;

    > svg {
      width: 0.8rem;
      height: 0.8rem;
      margin-right: 0.3rem;
    }

    &:hover {
      filter: brightness(80%);
    }
  }

  //Button link pattern to be used in all GOJUR App
  //Example buttons: links see more or less, includes in modals, sub lists etc
  //Sidney 08/2021
  .buttonLinkClick {
    cursor:pointer;
    color: var(--blue-twitter);
    font-size: 0.625rem;
    margin-right:0.5rem;
    font-family: montserrat;
    justify-content: center;

    > svg {
      color: var(--blue-twitter);
      width: 0.9rem;
      height: 0.9rem;
      margin-right: 0.3rem;

      &:hover {
        color: var(--orange);
      }
    }

    &:hover {
      color: var(--orange);
    }
  }

  //Button link class pattern to be used in all GOJUR App
  //Example buttons: selecione todos - publication or sales funnel filter options
  //Sidney 08/2021
  .buttonCheckBox {

      padding: 0.4rem;
      /* border-radius: 0.25rem; */
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

  .react-modal-overlay {
    background-color: rgba(0,0,0, 0.25);
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index:99999;
  }

  .react-modal-overlay2 {
    background-color: rgba(0,0,0, 0.25);
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index:99998;
  }

  .react-modal-content {
    width: 100%;
    max-width: 576px;
    background-color: var(--white-card);
    padding: 3rem;
    position: relative;
    border-radius: 0.1rem;
    z-index: 99999;
  }

  .react-modal-peoplesModal {
    width: 50%;
    max-width: 576px;
    padding: 3rem;
    position: relative;
    border-radius: 0.1rem;
    z-index: 99999;
    margin-bottom: 25%;
    margin-right: 20%;
  }

  .react-modal-peoplesModalMobile {
    width: 50%;
    max-width: 576px;
    padding: 3rem;
    position: relative;
    border-radius: 0.1rem;
    z-index: 99999;
    margin-bottom: 120%;
    margin-right: 35%;
  }

  .react-modal-customerModal {
    width: 50%;
    max-width: 576px;
    padding: 3rem;
    position: relative;
    border-radius: 0.1rem;
    z-index: 99999;
    margin-bottom: 52%;
    margin-right: 20%;
  }

  .react-modal-customerModalMobile {
    width: 50%;
    max-width: 576px;
    padding: 3rem;
    position: relative;
    border-radius: 0.1rem;
    z-index: 99999;
    margin-bottom: 200%;
    margin-right: 90%;
  }

  .react-modal-content-large {
    width: 65%;
    background-color: var(--white-card);
    padding: 3rem;
    position: relative;
    overflow: auto;
    border-radius: 0.1rem;
  }

  .react-modal-content-medium {
    width: 100%;
    max-width: 850px;
    background-color: var(--white-card);
    padding: 3rem;
    position: relative;
    overflow: auto;
    border-radius: 0.1rem;
  }

  .react-modal-content-OAB {
    width: 75%;
    background-color: var(--white-card);
    padding: 3rem;
    position: relative;
    overflow: auto;
    border-radius: 0.1rem;
  }

  .react-modal-content-DealDefaultCategory {
    width: 70%;
    max-height: 650px;
    background-color: var(--white-card);
    padding: 3rem;
    position: relative;
    overflow: auto;
    border-radius: 0.3rem;
    z-index: 99998;
  }

  .react-modal-close {
    position: absolute;
    right: 1.5rem;
    top: 1rem;
    border: 0;
    background: transparent;
    transition: filter 0.2s;

    svg {
      color: var(--secondary);
    }

    &:hover{
      filter: brightness(80%);
      svg {
        color: var(--orange);
      }
    }
  }

  // Follow matter button
  .react-switch{
    width:0.5rem;
    height:0.5rem;
    margin-left:10px;
    margin-bottom:10px;
  }

  // tags matter inputs
  .ReactTags__tag {
    background-color: #FAFF4C;
    height:25px;
    display:inline-block;
    padding:0.3rem;
    margin: 0.3rem;
    margin-bottom:10px;
    cursor: pointer;
  }

  // message on bottom loading something
  .waitingMessage {
    position:absolute;
    bottom:0;
    float:right;
    right:0;
    background: var(--yellow);
    box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.4);
    border-radius: 0.25rem;
    text-align:center;
    font-size:0.7rem;
    font-weight:400;
    color:var(--blue-twitter);
    font-family: Montserrat;verdana;
    padding: 0.5rem 0.5rem;
    margin-right:1.7rem;
    margin-bottom:1px;
    cursor:pointer;
    z-index:999999;
    min-width:10rem;

    svg{
      cursor:pointer;
      width:0.85rem;
      height:0.85rem;
      color: var(--blue-twitter);
    }
  }

  // React tags styles
  .ReactTags__tagInputField { margin:5px;}
  .ReactTags__selected{ display:flex; }
  .ReactTags__remove{margin-left:3px; margin-right:1px; }

}`;

export const Overlay = styled.div`
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

export const AutoCompleteSelect = styled.div`
  font-size: 0.625rem;
  margin: 0.3rem;
`;

export const GridContainer = styled.div`
  width: 95%;
  font-size: 0.3rem;
  margin-left: 2%;
  font-family: Montserrat;

  span {
    font-size: 0.675rem;
    color: var(--blue-twitter);
  }

  big {
    font-size: 0.675rem;
    color: var(--blue-twitter);
  }

  svg {
    width: 1rem;
    height: 1rem;
    margin-left: 0.8rem;
    color: var(--blue-light);
    cursor: pointer;

    &:hover {
      color: var(--orange);
    }
  }
  & tbody tr:nth-of-type(odd) {
    background-color: #d9ecec;
  }
`;

// this container is used by sub grid inside a edit page like matter edit (orders, documents, court etc)
export const GridSubContainer = styled.div`
  width: 100%;
  font-family: Montserrat;
  margin-top: 20px;
  border: 1px solid rgba(0, 0, 0, 0.15);

  big {
    font-size: 0.675rem;
    color: var(--blue-twitter);
  }

  span {
    font-size: 0.65rem;
    color: var(--blue-twitter);
  }

  text-decoration {
    font-size: 0.7rem;
    color: var(--blue-twitter);
  }

  table tr td {
    white-space: inherit;
    font-size: 0.7rem;
  }

  svg {
    width: 1rem;
    height: 1rem;
    color: var(--blue-light);
    cursor: pointer;

    &:hover {
      color: var(--orange);
    }
  }
  & tbody tr:nth-of-type(odd) {
    background-color: #d9ecec;
  }
`;

export const GridContainerMobile = styled.div`
  width: 120%;
  margin-left: 1%;
  font-family: Montserrat;
  font-size: 575rem;

  span {
    font-size: 0.575rem;
    color: var(--blue-twitter);
  }

  .MuiTableCell-root {
    font-size: 0.675rem;
    padding: 8px;
  }

  big {
    font-size: 0.575rem;
    color: var(--blue-twitter);
  }

  svg {
    width: 1rem;
    height: 1rem;
    color: var(--blue-light);
    cursor: pointer;

    &:hover {
      color: var(--orange);
    }
  }
  & tbody tr:nth-of-type(odd) {
    background-color: #d9ecec;
  }
`;

export const GridContainerSimple = styled.div`
  width: 95%;
  margin-left: 1%;
  font-family: Montserrat;
  font-size: 12px;

  td {
    max-height: 1px;
    font-size: 0.75rem;
  }

  span {
    font-size: 14px;
    // font-size:0.75rem;
    color: var(--blue-twitter);
  }

  big {
    font-size: 14px;
    // font-size:0.75rem;
    color: var(--blue-twitter);
  }

  td {
    font-size: 12px;
    padding: 6px;
  }

  svg {
    width: 1rem;
    height: 1rem;
    margin-left: 0.8rem;
    color: var(--blue-light);
    cursor: pointer;
    font-size: 14px;

    &:hover {
      color: var(--orange);
    }
  }

  & tbody tr:nth-of-type(odd) {
    background-color: #d9ecec;
  }
`;

export const TreeViewContainer = styled.div`
  width: 100%;
  height: 100vh;
  margin: 1rem;
  padding: 1rem;
  justify-content: center;
  display: flex;
  margin-left: 1%;
  font-family: Montserrat;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 0.25rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0, 0, 0, 0.15);

  > div {
    width: 50vw;
    height: 80vh;
    padding-left: 23%;
    padding-top: 1rem;
  }
  svg {
    width: 2rem;
    height: 2rem;
    color: var(--blue-light);
    cursor: pointer;

    &:hover {
      color: var(--orange);
    }
  }
`;

export const TreeViewContainerSimple = styled.div`
  background-color: var(--gray);
  border-color: var(--gray);

  > div {
    padding-top: 1rem;
    background-color: var(--gray);
    border-color: var(--gray);
  }
  svg {
    width: 2rem;
    color: var(--blue-light);
    background-color: var(--gray);
    border-color: var(--gray);

    cursor: pointer;

    &:hover {
      color: var(--orange);
    }
  }

  .deni-react-treeview-container {
    font-size: 18px;
    width: 100%;
    height: 100%;
  }
`;
export const GridContainerEconomicIndexesMobile = styled.div`
  width: 47%;
  height: 10%;
  margin-left: 2%;
  font-family: Montserrat;
  margin-top: -15%;
  margin-bottom: 50%;

  span {
    font-size: 0.675rem;
    color: var(--blue-twitter);
  }

  big {
    font-size: 0.675rem;
    color: var(--blue-twitter);
  }

  svg {
    width: 1rem;
    height: 1rem;
    margin-left: 0.8rem;
    color: var(--blue-light);
    cursor: pointer;

    &:hover {
      color: var(--orange);
    }
  }
  & tbody tr:nth-of-type(odd) {
    background-color: #d9ecec;
  }
`;

export const GridContainerEconomicIndexes = styled.div`
  width: 60%;
  margin-left: 20%;
  font-family: Montserrat;

  span {
    font-size: 0.675rem;
    color: var(--blue-twitter);
  }

  big {
    font-size: 0.675rem;
    color: var(--blue-twitter);
  }

  svg {
    width: 1rem;
    height: 1rem;
    margin-left: 0.8rem;
    color: var(--blue-light);
    cursor: pointer;

    &:hover {
      color: var(--orange);
    }
  }
  & tbody tr:nth-of-type(odd) {
    background-color: #d9ecec;
  }
`;
