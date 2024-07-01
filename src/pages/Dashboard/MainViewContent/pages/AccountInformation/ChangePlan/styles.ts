import styled from 'styled-components';


interface cardSize{
  autoSizeCard?: boolean;
}


export const OverlayPublicationNames = styled.div `
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


export const PageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 100px;
`;


export const TollBar = styled.div`
  display: flex;
  max-height: 1.5rem;
  font-size: 0.65rem;
  justify-content: space-between;
  margin-top:auto;
  margin-bottom:auto;
  margin-left:400px;
`;


export const Container = styled.div`
  flex: 1;
  height: 100%;
  overflow: auto;
  max-height: 100%;
  @media (min-width: 480px) {
    padding: 0.2rem 1.5rem; // browser
  }

  .selectResources{
    font-size: 15px;
    margin-top:auto;
    margin-bottom:auto;
    margin-left:10px;
  }

  .qtdLabel{
    font-size: 14px;
    margin-left:20px;
    margin-top:auto;
    margin-bottom:auto;
  }

  .resourceNumber{
    margin-top:auto;
    margin-bottom:auto;
    margin-left:10px;
  }

  .resourceNumberInput{
    background-color:white;
    width:75px;
  }

  .resourceValueInput{
    background-color:white;
    width:100px;
  }

  .infoMessage{
      color: var(--blue-twitter);  
      margin-left:10px;
      width:1rem;
      height:1rem;
      margin-top:auto;
      margin-bottom:auto;
    }

    .button-box {
      display: flex;
      width: 250px;
      margin: 35px auto;
      position: relative;
      border-radius: 30px;
      background: #fff;
    }

    .toggle-btn {
      padding: 10px 35px;
      cursor: pointer;
      background: transparent;
      border: 0;
      outline: none;
      position: relative;
      text-align: center;
      font-size: 14px;
      font-weight: bolder;
    }

    .buttn {
      left: 0;
      top: 0;
      position: absolute;
      width: 110px;
      height: 100%;
      background: var(--blue-twitter);
      border-radius: 30px;
      transition: .3s;
    }

    .button-box-resources {
      display: flex;
      width: 200px;
      position: relative;
      border-radius: 30px;
      background: #fff;
      margin-left: 15px;
    }

    .toggle-btn-resources {
      padding: 10px 35px;
      cursor: pointer;
      background: transparent;
      border: 0;
      outline: none;
      position: relative;
      text-align: center;
      font-size: 14px;
      font-weight: bolder;
    }

    .buttn-resources {
      left: 100px;
      top: 0;
      position: absolute;
      width: 103px;
      height: 100%;
      background: var(--blue-twitter);
      border-radius: 30px;
      transition: .3s;
    }

    input, select {
      flex: 1;
      font-size: 0.675rem;
      padding: 0.25rem;
      background-color: rgba(255,255,255,0.25);
      width: 100%;
      border-bottom: 1px solid rgba(0,0,0,0.15);
      color: var(--secondary);

      &:focus {
        border-bottom: 1px solid var(--orange);
      }
    }
`;


export const OverlayModal = styled.div `
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


export const TaskBar = styled.div`
  display: flex; 
  align-items: center;
  justify-content: space-between;
 
  div {
    display: flex;
    align-items: center;
    justify-content: center;
   
    #options {
     display: flex;
     align-items: center;
     justify-content: center;
     border-radius: 0.25rem;

     svg {
       color: var(--blue);
       width: 1.5rem;
       height: 1.5rem;
     }

     &:hover {
       svg {
        color: var(--orange);
       }
      }
    }
  }

  p {
    font-family: Montserrat;
    font-size: 0.625rem;
    color: var(--secondary);
  }
`;


export const Content = styled.div`
    font-family: 'Poppins', sans-serif;
    flex: 1;
    background-color: var(--white);
    border-radius: 0.25rem;
    box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);

  body{
    max-height: 90%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .border2{
    border-bottom: 1px solid transparent;
    height:2px;
  }

  .border{
    border-bottom: 1px solid black;
    margin-bottom: 15px;
    margin-top: 30px;
  }

  .borderBottom{
    border-bottom: 1px solid transparent;
    margin-bottom: 15px;
    margin-top: 30px;
  }

  .additional {
    margin: 10px;
    margin-top: 15px;
  }

  #message
  {
    margin-left:3rem;
    margin-right:3rem;
    padding:0.5rem;
    border-top:solid 2px;
    border-color: var(--gray);
    font-size:0.9rem;
    color: var(--secondary);
    justify-content: center;
    text-align:center;
    font-family:verdana;
    text-justify:justify;


    svg {
      width: 1rem;
      height:1rem;
      margin-right:5px;
      margin-top:5px;
      color: var(--blue-twitter);
    }

    span {
      color: var(--blue-twitter);
    }

    div {
      margin-top:10px;
      font-size:0.7rem;
      svg {
        width: 1rem;
        height:1rem;
        margin-top:5px;
        color: var(--blue-twitter);
      }
    }
  }

  #message2
  {
    display:flex;
    font-size:0.9rem;
    color: var(--secondary);
    font-family:verdana;
    text-justify:justify;
    justify-content: center;
    margin-top: 20px;

    span {
      color: var(--blue-twitter);
    }

    div {
      font-size:0.7rem;
      svg {
        width: 1rem;
        height:1rem;
        margin-top:5px;
        color: var(--blue-twitter);
      }
    }
  }

  .totals {
    font-size: 14px;
    text-align: left;
    width:14rem;
    margin-left:1rem;
    margin-right: 1%;
    border: 1px solid rgba(0,0,0,0.1);
    padding: 0.2rem;
    float: right;

    span{
        font-weight:500;
        color:black;
    }

    span:last-child{
        font-weight:600;
        color:green;
        font-size: 14px;
    }
}

  #headerLabel{
    display: flex;
    font-size:0.9rem;
    color: var(--secondary);
    font-family: verdana;
    text-justify: justify;
    justify-content: center;
    margin-top: 20px;

    span {
      color: var(--blue-twitter);
    }

    div {
      font-weight: bold;
      font-size:1rem;
      color: var(--blue-twitter);
      border-bottom: 1px solid var(--blue-twitter);
      width: 400px;
      text-align: center;
    }
  }

.wrapper{
  width: 90%;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  margin-top:1%;
  justify-content: space-between;
}

.wrapperSelected{
  width: 80%;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  margin-top:1%;
  justify-content: center;
}

.wrapper .table{
  background: #fff;
  width: calc(33% - 20px);
  padding: 30px 30px;
  position: relative;
  box-shadow: 0 5px 10px rgba(0,0,0,0.1);
  margin-top:10px;
  margin-bottom:20px;
}

.wrapperSelected .table{
  background: #fff;
  width: 70%;
  padding: 30px 30px;
  position: relative;
  box-shadow: 0 5px 10px rgba(0,0,0,0.1);
  margin-top:10px;
  margin-bottom:20px;
}
.table .price-section{
  display: flex;
  justify-content: center;
}
.table .price-area{
  height: 120px;
  width: 120px;
  border-radius: 50%;
  padding: 2px;
}
.price-area .inner-area{
  height: 100%;
  width: 100%;
  border-radius: 50%;
  border: 3px solid #fff;
  line-height: 117px;
  text-align: center;
  color: #fff;
  position: relative;
  font-family: Montserrat;
}
.price-area .inner-area .text{
  font-size: 13px;
  font-weight: 400;
  position: absolute;
  top: -23px;
  left: 10px;
  font-family: Montserrat;
}

.price-area .inner-area .text2{
  font-size: 13px;
  font-weight: 400;
  position: absolute;
  top: 25px;
  left: 30px;
}

.price-area .inner-area .price{
  font-size: 26.5px;
  font-weight: 500;
  font-family: Montserrat;
  margin-left: 1px;
}
.table .package-name{
  width: 100%;
  height: 2px;
  margin: 35px 0;
  position: relative;
}
.table .package-name::before{
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 25px;
  font-weight: 500;
  background: #fff;
  padding: 0 15px;
  transform: translate(-50%, -50%);
}
.table .features li{
  margin-bottom: 15px;
  list-style: none;
  display: flex;
  justify-content: space-between;
  font-family: Montserrat;
}
.features li .list-name{
  font-size: 15px;
  font-weight: 400;
  font-family: Montserrat;

  b {
    font-family: Montserrat;
  }
}
.features li .icon{
  font-size: 15px;
}
.features li .icon.check{
  color: var(--blue)
}
.features li .icon.cross{
  color: #cd3241;
}
.table .btn{
  width: 100%;
  display: flex;
  margin-top: 35px;
  justify-content: center;
}
.table .btn button{
  width: 80%;
  height: 50px;
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  border: none;
  outline: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: Montserrat;
}
.table .btn button:hover{
  border-radius: 5px;
}
.free .features li::selection{
  background: #ffd861;
}
.free ::selection,
.free .price-area,
.free .inner-area{
  background: var(--blue)
}
.free .btn button{
  border: 2px solid #ffd861;
  background: #fff;
  color: #ffd861;
}
.free .btn button:hover{
  background: var(--blue);
  color: #fff;
}
.user ::selection,
.user .price-area,
.user .inner-area{
  background: var(--blue);
}
.user .btn button{
  background: var(--blue);
}
.user .btn button:hover{
  background: orange;
  color: #fff;
}
.light ::selection,
.light .price-area,
.light .inner-area,
.light .btn button{
  background: var(--blue);
}
.light .btn button:hover{
  background: orange;
}
.smart ::selection,
.smart .price-area,
.smart .inner-area,
.smart .btn button{
  background: var(--blue);
}
.smart .btn button:hover{
  background:orange;
  color: #fff;
}
.essential ::selection,
.essential .price-area,
.essential .inner-area{
  background: var(--blue);
}
.essential .btn button{
  background: var(--blue);
}
.essential .btn button:hover{
  background: orange;
  color: #fff;
}
.top ::selection,
.top .price-area,
.top .inner-area{
  background: var(--blue);
}
.top .btn button{
  background: var(--blue);
}
.top .btn button:hover{
  background: orange;
  color: #fff;
}
.free .package-name{
  background: orange;
}
.user .package-name{
  background: orange;
}
.light .package-name{
  background: orange;
}
.smart .package-name{
  background: orange;
}
.essential .package-name{
  background: orange;
}
.top .package-name{
  background: orange;
}
.free .package-name::before{
  content: "Free";
}
.light .package-name::before{
  content: "Light";
  font-size: 24px;
}
.smart .package-name::before{
  content: "Smart";
  font-size: 24px;
}
.essential .package-name::before{
  content: "Essential";
  font-size: 24px;
}
.top .package-name::before{
  content: "Top";
  font-size: 24px;
}
.user .package-name::before{
  content: "Usuário";
  font-size: 24px;
}
@media (max-width: 1020px) {
  .wrapper .table{
    width: calc(50% - 20px);
    margin-bottom: 40px;
  }
}
@media (max-width: 500px) {
  .wrapper .table{
    width: 100%;
  }
}
::selection{
  color: #fff;
}
.table .ribbon{
  width: 150px;
  height: 150px;
  position: absolute;
  top: -10px;
  left: -10px;
  overflow: hidden;
}
.table .ribbon::before,
.table .ribbon::after{
  position: absolute;
  content: "";
  z-index: -1;
  display: block;
  border: 7px solid #4606ac;
  border-top-color: transparent;
  border-left-color: transparent;
}
.table .ribbon::before{
  top: 0px;
  right: 15px;
}
.table .ribbon::after{
  bottom: 15px;
  left: 0px;
}
.table .ribbon span{
  position: absolute;
  top: 30px;
  right: 0;
  transform: rotate(-45deg);
  width: 200px;
  background: orange;
  padding: 10px 0;
  color: #fff;
  text-align: center;
  font-size: 17px;
  text-transform: uppercase;
  box-shadow: 0 5px 10px rgba(0,0,0,0.12);
}
`;


export const ResourceCard = styled.div`
  width: 250px;
  background-color: #FFFFFF;
  box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.4);
  border-radius: 0.25rem;
  float: left;
  margin-left: 20px;

  .bloco1{
    height: 210px;
    text-align: center;
    align-content: center;
    margin-top: 5px;
  }

  .bloco2{
    background-color: #F0F0F0;
    height: 40px;
    font-size: 14px;
    align-content: space-around;
  }

  .bloco3{
    background-color: #F0F0F0;
    height: 40px;
    font-size: 14px;
    align-content: space-around;
    margin-top: -4px;
  }

  .bloco4{
    background-color: #F0F0F0;
    height: 40px;
    font-size: 12px;
  }

  .bloco5{
    background-color: #F0F0F0;
    height: 40px;
    font-size: 14px;
  }

`;
