import styled from 'styled-components';

export const Container = styled.div` 
  margin-top:0.5rem;
  font-size:0.8rem;
  font-weight:500;
  color:var(--blue-twitter);
  
  .buttonRight{
    float:right;
    margin-bottom:10px;
  }

  textarea { 
    resize: vertical; 
  }

  .buttonsSaveActivity{
    margin-top: -10px;
    margin-left:-10px;
    cursor: pointer;
    width: 100%;   // mobile
    @media (min-width: 480px) {
      width: 203%; // browser
    }  
    height:35px;

    >span{
      margin-left: 37vw;
    }
  }

  > svg{
    width:1rem;
    height:1rem;
    color:var(--blue-twitter);
  }
`;


export const ActivityItem = styled.div`
  flex:1;
  width: 100%;   // mobile
  @media (min-width: 480px) {
    width: 203%; // browser
  } 
  margin-top:-2rem;
    
  .activityUserCreate{
    position:absolute;
    font-family:Montserrat verdana;

    .label {    
      color: var(--primary);
      font-size:0.50rem;
    }

    .text {    
      color: var(--primary);
      font-weight:600;
      font-size:0.50rem;
    }
  }

  .activityUserUpdate {    
    color: var(--secondary);
    font-family:Montserrat verdana;
    float: left;
    margin-left: 4px;
    margin-top: 15px;
  }

    .label {    
      color: var(--grey);
      font-size:0.65rem;
      font-weight:300;
    }

    .text {    
      color: var(--primary); 
      font-size:0.65rem; 
      font-weight:300;

    }
  }

  .activityText {
    background-color: var(--white);
    border: 1px solid rgba(0,0,0,0.2);
    border-radius: 0.20rem; 
    padding:0.3rem;
    font-size:0.65rem;
    width:100%;
    cursor:pointer;
    white-space: pre-line;
  }

`;

export const Avatar = styled.img`
  width: 1.7rem;
  height: 1.7rem;
  border-radius: 50%;
  border: 1px solid var(--blue-twitter);
  transition: opacity 0.5s;
  float: left;
  margin: 1px;
`;