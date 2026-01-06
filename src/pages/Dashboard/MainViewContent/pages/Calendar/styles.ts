import styled from 'styled-components';

interface SearchProps {
  show:boolean
}


export const Container = styled.div`
  height:100%;
  overflow:auto;
`;


export const Content = styled.div`
  position:relative;
  font-size:0.765rem;
  margin:0.2rem;
  width:94vw;
  background-color:var(--white);
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);

  #fc-dom-1 {
    font-weight:600;
    font-size:0.8rem;
    margin-top:10px;
    font-family: Montserrat;
    text-transform: capitalize;
  }

  #fc-dom-2 {
    font-weight:600;
    font-size:0.8rem;
    margin-top:10px;
    font-family: Montserrat;
    text-transform: capitalize;
  }

  .fc-more-popover {
    z-index: 1;
  }

  .fc-col-header-cell-cushion{
    text-transform: capitalize;
    font-weight:500;
  }

  .select {
    margin-left:0.5rem;
    font-size:0.675rem;
    height:auto;
    width:15rem;
    border-radius:25px;
  }

  #hamburguerMenu {
    flex:1;
    position:absolute;
    right:0;
    margin-right:10px;
    justify-content: flex-end;

    svg {
      color: var(--blue);
      width: 1.5rem;
      height: 1.5rem;
    }

    &:hover {
      svg { color: var(--orange); }
    }
  }

   .fc-toolbar-chunk {
    font-size:0.65rem;
    margin:0.2rem;
  }

  .fc-toolbar-title{
    font-weight:400;
    font-size:0.865rem;
    font-family:montserrat;
  }

  .fc{
    font-size:0.675rem;
    font-weight:200;
  }
`;


export const ModalFast = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size:0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:22rem;
  height:19rem;
  background-color:var(--white);
  position:absolute;
  z-index:99999;
  justify-content:center;
  margin-left:35%;
  margin-top:10%;
  display: ${props => (props.show ? 'block' : 'none')};

  input, select {
      flex: 1;
      font-size: 0.675rem;
      padding: 0.25rem;
      background-color: rgba(255,255,255,0.25);
      width: 99%;
      border-bottom: 1px solid rgba(0,0,0,0.15);
      color: var(--secondary);

      &:focus {
        border-bottom: 1px solid var(--orange);
      }
    }
`;


export const ModalFastMobile = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size:0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:22rem;
  height:24rem;
  background-color:var(--white);
  position:absolute;
  z-index:99999;
  justify-content:center;
  margin-left:15%;
  margin-top:10%;
  display: ${props => (props.show ? 'block' : 'none')};

  input, select {
      flex: 1;
      font-size: 0.675rem;
      padding: 0.25rem;
      background-color: rgba(255,255,255,0.25);
      width: 99%;
      border-bottom: 1px solid rgba(0,0,0,0.15);
      color: var(--secondary);

      &:focus {
        border-bottom: 1px solid var(--orange);
      }
    }
`;


export const ModalParameters = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size:0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:22rem;
  height:29rem;
  background-color:var(--white);
  position:absolute;
  z-index:99999;
  justify-content:center;
  margin-left:35%;
  margin-top:-6%;
  display: ${props => (props.show ? 'block' : 'none')};

  input, select {
      flex: 1;
      font-size: 0.675rem;
      padding: 0.25rem;
      background-color: rgba(255,255,255,0.25);
      width: 99%;
      border-bottom: 1px solid rgba(0,0,0,0.15);
      color: var(--secondary);

      &:focus {
        border-bottom: 1px solid var(--orange);
      }
    }
`;


export const ModalParametersMobile = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size:0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:22rem;
  height:34rem;
  background-color:var(--white);
  position:absolute;
  z-index:99999;
  justify-content:center;
  margin-left:35%;
  margin-top:-6%;
  display: ${props => (props.show ? 'block' : 'none')};

  input, select {
      flex: 1;
      font-size: 0.675rem;
      padding: 0.25rem;
      background-color: rgba(255,255,255,0.25);
      width: 99%;
      border-bottom: 1px solid rgba(0,0,0,0.15);
      color: var(--secondary);

      &:focus {
        border-bottom: 1px solid var(--orange);
      }
    }
`;


export const ModalSubject = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size:0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:20rem;
  height:21rem;
  background-color:var(--white);
  position:absolute;
  z-index:99999;
  justify-content:center;
  margin-left:35%;
  margin-top:5%;
  display: ${props => (props.show ? 'block' : 'none')};

  .ModalSubjectColorButton {
    width : 25px;
    height: 25px;
    border-top: solid 2px #626262;
    border-left: solid 2px #626262;
    border-right: solid 2px black;
    border-bottom: solid 2px black;
  }

  input, select {
      flex: 1;
      font-size: 0.675rem;
      padding: 0.25rem;
      background-color: rgba(255,255,255,0.25);
      width: 99%;
      border-bottom: 1px solid rgba(0,0,0,0.15);
      color: var(--secondary);

      &:focus {
        border-bottom: 1px solid var(--orange);
      }
    }
`;


export const ModalReport = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size:0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:60%;
  height:30rem;
  background-color:var(--white);
  position:absolute;
  z-index:9999;
  justify-content:center;
  margin-left:20%;
  margin-top:5%;
  display: ${props => (props.show ? 'block' : 'none')};

  input, select {
      flex: 1;
      font-size: 0.675rem;
      padding: 0.25rem;
      background-color: rgba(255,255,255,0.25);
      width: 99%;
      border-bottom: 1px solid rgba(0,0,0,0.15);
      color: var(--secondary);

      &:focus {
        border-bottom: 1px solid var(--orange);
      }
    }
`;


export const ListSearch = styled.div<SearchProps>`
  font-size:0.765rem;
  width:100%;
  height:100%;
  overflow:auto;
  position:absolute;

  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  padding:1rem;
  background-color:var(--white);
  z-index:1000;
  display: ${props => (props.show ? 'block' : 'none')};


  >div{
    display: flex;
    flex-direction: column;
    justify-content:space-between;
    padding:0.5rem;
  }

  .headerSearch{
    font-size:0.625rem;
    font-family: montserrat;
    color:var(--blue-twitter);
    display:flex;
    justify-content: space-between;
  }

  .itemCalendar {
    display: flex;
    border-bottom: 1px solid var(--grey);
    height:2.5rem;
    font-size:0.625rem;
    font-family:montserrat;
    justify-content: space-evenly;
    padding:0.5rem;
    cursor:pointer;
    margin:0.5rem;
  }

  .calendarDate{
    width:15%;
  }

  .calendarSubject{
    color:var(--white);
    width:15%;
    text-align:center;
    justify-content:center;
    padding-top:5px;
    margin-right:1rem;
    border-radius:20px;
  }

  .calendarTitle{
    width:65%;
  }

`;


export const ListSearchMobile = styled.div<SearchProps>`
  font-size:0.765rem;
  width:100%;
  height:100%;
  overflow:auto;
  position:absolute;

  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  padding:1rem;
  background-color:var(--white);
  z-index:1000;
  display: ${props => (props.show ? 'block' : 'none')};


  >div{
    display: flex;
    flex-direction: column;
    justify-content:space-between;
    padding:0.5rem;
  }

  .headerSearch{
    font-size:0.625rem;
    font-family: montserrat;
    color:var(--blue-twitter);
    display:flex;
    justify-content: space-between;
  }

  .itemCalendar {
    display: flex;
    border-bottom: 1px solid var(--grey);
    height:6rem;
    font-size:0.625rem;
    font-family:montserrat;
    justify-content: space-evenly;
    padding:0.5rem;
    cursor:pointer;
    margin:0.5rem;
  }

  .calendarDate{
    width:15%;
  }

  .calendarSubject{
    color:var(--white);
    width:15%;
    text-align:center;
    justify-content:center;
    padding-top:5px;
    margin-right:1rem;
    border-radius:20px;
  }

  .calendarTitle{
    width:65%;
  }

`;


export const TaskBar = styled.div`
  display: flex;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);

  >div{
    display:flex;
    font-size:0.65rem;
    font-family:Montserrat;
    background-color:var(--white);
    width:100%;
    padding-bottom:6px;

    
.calendar-filter-wrapper {
  position: relative;
}

/* Escondido por padrão */
.assunto-integrado {
  display: none;
  background: #fff;
  padding: 6px;
  border: 1px solid #ddd;
  border-top: none;
}

/* Quando o dropdown do MultiSelect estiver aberto */
.calendar-filter-wrapper
  .dropdown-content
  + .assunto-integrado {
  display: block;
}

/* Estilo do select */
.assunto-select {
  width: 100%;
  height: 36px;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}




    .icons{
      margin-top:22px;
      margin-left:10px;
      width:1rem;
      height:1rem;
      cursor:pointer;
    }

    .select {
      margin-left:0.5rem;
      font-size:0.675rem;
      width:20rem;
      border-radius:25px;
      margin-top:8px;
      //z-index:1000;

      >div{
        border: 1px solid var(--grey);
        border-radius:10px;
        text-align:center;
        z-index:9999;
      }
    }

    .buttonLinkClick{
      min-width:9rem;
      margin-top:10px;
    }
  }

  .buttonHamburguer {
    justify-content:end;
    text-align:center;
    padding-right:1rem;
    padding-top:0.5rem;
    position:relative;
    >div{
      margin-right:-1rem;
      margin-top:-4.5rem;
      position:absolute;
    }
    .iconMenu {
      color: var(--blue);
      width: 1.5rem;
      height: 1.5rem;
    }
  }
`;


export const TaskBarMobile = styled.div`
  display: flex;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);

  .gdVnV{
    width:50%;
  }

  >div{
    // display:flex;
    font-size:0.65rem;
    font-family:Montserrat;
    background-color:var(--white);
    width:100%;
    padding-bottom:6px;

    .icons{
      margin-top:22px;
      margin-left:10px;
      width:1rem;
      height:1rem;
      cursor:pointer;
    }

    .select {
      margin-left:0.5rem;
      font-size:0.675rem;
      width:20rem;
      border-radius:25px;
      margin-top:38px;

      >div{
        border: 1px solid var(--grey);
        border-radius:10px;
        text-align:center;
        z-index:9999;
      }
    }

    .buttonLinkClick{
      min-width:9rem;
      margin-top:10px;
    }
  }

  .buttonHamburguer {
    justify-content:end;

    padding-right:1rem;
    padding-top:0.5rem;

    >div{
      margin-right:-1rem;
      margin-top:-4.5rem;
      position:absolute;
    }
    .iconMenu {
      color: var(--blue);
      width: 1.5rem;
      height: 1.5rem;
    }
  }
`;


export const ModalDateSelect = styled.div`
  border: 1px solid var(--blue-twitter);
  font-size: 0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width: 400px;
  min-height: 10rem;
  max-height: 12rem;
  overflow: auto;
  background-color: var(--white);
  position: absolute;
  z-index: 99999;
  justify-content: center;
  margin-left: 35%;
  margin-top: 2%;

  > svg {
    width:1rem;
    height:2rem;
    color: white;
  }

  input, select {
    flex: 1;
    font-size: 0.675rem;
    padding: 0.25rem;
    background-color: #FFFFFF;
    width: 99%;
    border-bottom: 1px solid rgba(0,0,0,0.15);
    color: var(--secondary);

    &:focus {
    border-bottom: 1px solid var(--orange);
    }
  }

  .menuTitle {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
    color: black;
    text-align: center;
    float: left;
    width: 93%;
    background-color: #dcdcdc;
    height: 27px;
  }

  .menuSection {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
    color: var(--blue-twitter);
    text-align: right;
    cursor: pointer;
    float: left;
    width: 6.9%;
    background-color: #dcdcdc;
    height: 27px;

    > svg {
      width: 0.85rem;
      height: 0.85rem;
      stroke-width: 3px;
    }

    &:hover {
      color: var(--orange);
    }
  }
`;


export const ModalDateSelectMobile = styled.div`
  border: 1px solid var(--blue-twitter);
  font-size: 0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width: 250px;
  min-height: 10rem;
  max-height: 12rem;
  overflow: auto;
  background-color: var(--white);
  position: absolute;
  z-index: 99999;
  justify-content: center;
  margin-left: 10%;
  margin-top: 2%;

  > svg {
    width:1rem;
    height:2rem;
    color: white;
  }

  input, select {
    flex: 1;
    font-size: 0.675rem;
    padding: 0.25rem;
    background-color: #FFFFFF;
    width: 99%;
    border-bottom: 1px solid rgba(0,0,0,0.15);
    color: var(--secondary);

    &:focus {
    border-bottom: 1px solid var(--orange);
    }
  }

  .menuTitle {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
    color: black;
    text-align: center;
    float: left;
    width: 93%;
    background-color: #dcdcdc;
    height: 27px;
  }

  .menuSection {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
    color: var(--blue-twitter);
    text-align: right;
    cursor: pointer;
    float: left;
    width: 6.9%;
    background-color: #dcdcdc;
    height: 27px;

    > svg {
      width: 0.85rem;
      height: 0.85rem;
      stroke-width: 3px;
    }

    &:hover {
      color: var(--orange);
    }
  }
`;
