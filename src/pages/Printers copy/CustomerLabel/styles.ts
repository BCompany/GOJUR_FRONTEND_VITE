import styled from 'styled-components';

export const OverlayMatterLabel = styled.div `
    background-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index:1;

    /* text inside overlay */
    >div{
      background: var(--white-card);
      height:3rem;
      color:var(--blue-twitter);
      font-size:0.765rem;
      text-align:center;
      padding:1rem;
      margin-left:30vw;
      margin-right:25vw;
      margin-top:20%;
      border-radius: 0.25rem;
      box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
    }
`;


export const ContainerMobile = styled.div`
  flex: 1;
  font-size:0.675rem;
  overflow: auto;
  margin-top: 50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  #information {
    margin-top: 30%;
    border: solid 1px;
    background-color: white;
    height: 78px;
    border-radius: 10px;
    color: #2c8ed6;
  }

  .information {
    margin-left: 8%;
  }
`;

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  font-size: 1px;
  background-color: #EDF0F7;

  input, select {
    flex: 1;
    font-size: 0.675rem;
    padding: 0.25rem;
    background-color: white;
    width: 100%;
    border-bottom: 1px solid rgba(0,0,0,0.15);

    &:focus {
      border-bottom: 1px solid var(--orange);
      #BtSvCl{
      margin-right: 10px
      }
    }
  }

  .divTop {
    border-bottom: 1px solid black;
  }

  .selectLabelBox{
    font-size: 14px;
    margin-top: auto;
    margin-bottom: auto;
    margin-Left: 1%;
    width: 12%;
  }

  .selectInput {
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 10px;
  }

  .edit {
    margin-left: 10px;
  }

  .checkBox{
    margin-top: auto;
    margin-left: 10px;
  }

  #borders {
    margin-bottom: 5px;
  }

  .labelSelect {
    width: 180px;
    font-size: 13px;
  }

  .labelAdjust{
    margin-bottom: 10px;
    margin-top: auto;
    margin-left: 18px;
  }

  .labelCalibrar{
    font-size: 12px;
    color: #2C8ED6;
  }

  .waitingReport {
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    margin-left:49vw;
    color: var(--blue-twitter);
}

  .printDiv {
    margin-left: 30px;
    margin-top: auto;
  }

  #buttonPrint {
    min-width: 15px;
    min-height: 15px;
  }

  .hamburgDiv{
    margin-left: 22%;
  }

  .areaHTML {
    width: 1%;
  }

  .areaHTMLDIv {
    width: 1%;
  }

  .infoMessage{
    color: var(--blue-twitter); 
    min-width: 17px;
    min-height: 17px;
    margin-top: 35px;
    margin-bottom: auto;
    margin-left: -10px;  
  }

  #options {
    svg {
      color: var(--blue);
      width: 1.5rem;
      height: 1.5rem;
    }

    &:hover {
      svg { color: var(--orange); }
  }
  }

  @media screen, print
{
	.customer-label-header {
        text-align: center;
        margin: 3% 0 0 0;
    }

  .customer-label-none {
    display: none;
  }

    .customer-label-detail {
        text-align: left;
        margin: 2% 5% 0 5%;
    }


    .customer-label-page {
        font-family: Verdana;
        position: relative;
        margin: 0;
        padding: 0;
        left: 0;
        top: 0;
    }


    .customer-label-container {
        position: absolute;
        left: 0.40cm;
        float: left;
        margin: 0;
        border-collapse: collapse;
        border: 1px dashed gray;
    }

    .customer-label-container-border {
        border: 1px solid black;
    }


    .customer-label-container:hover {
        cursor: pointer;
    }

    .print-filter label {
        width: 150px !important;
    }

    .page-break {
        page-break-after: always;
    }

}


`
