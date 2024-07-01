import styled from 'styled-components'

export const ContentMessage = styled.div`
  background-color:var(--yellow);
  font-size:0.80rem;
  font-family: Montserrat;
  text-align:center;
  padding:0.5rem;
  border-radius: 0.25rem;
  margin-bottom:10px;
  border: 1px solid var(--blue-twitter);

  >a{
    font-size:0.70rem;
    color: var(--blue-twitter);
    text-decoration: none;
    font-weight:500;
  }

  >svg:first-child{
    float:left;
    width:1.5rem;
    height:1.5rem;
    margin-top:5px;      
    margin-left:-5px;
  }
`;
