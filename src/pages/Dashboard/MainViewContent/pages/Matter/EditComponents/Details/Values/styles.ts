import styled from 'styled-components'

export const Header = styled.div`

  font-size: 0.765rem;
  font-weight:500;
  margin-bottom:1rem;
  font-family: Montserrat;
  text-align:center;
`

export const Container = styled.div`
  
  font-size: 0.675rem;
  font-family: Montserrat;
  max-height:50vh;
  overflow:auto;
  
  footer {
    text-align:center;
  }
  
  section {
    
    width:100%;
    display:flex;            
    flex:1;
    column-gap:1rem;
    
    >  label {

        flex:1;                                
        font-size: 0.675rem;
        color: var(--primary);
        margin:0.3rem;

        > svg {
            width:0.75rem; 
            height:0.75rem;    
            margin-left:10px;        
            color:var(--blue-twitter);
            cursor:pointer;
        }

        .inputField {
            
            font-size: 0.675rem;
            background-color: rgba(255,255,255,0.25);
            width: 100%;
            height:40px;
            border-bottom: 1px solid rgba(0,0,0,0.15);
            color: var(--secondary);

            &:focus {
                border-bottom: 1px solid var(--orange);
            }
        }
    }
    
    .css-yk16xz-control{
        background-color: rgba(255,255,255,0.25);
    }
  }

  .divisor {
    
    margin: 0.5rem 0.5rem;
    border-bottom: 1px solid var(--gray);        
    text-align:center;
    font-size:0.7rem;
    font-weight:400;
    color: var(--primary)
    
  }
`;

