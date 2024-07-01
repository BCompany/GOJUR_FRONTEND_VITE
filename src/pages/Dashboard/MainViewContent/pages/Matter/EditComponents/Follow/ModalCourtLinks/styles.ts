import styled from 'styled-components'


export const Container = styled.div`

  font-size: 0.675rem;
  font-family:montserrat, verdana;
  max-height:20rem;
  overflow:auto;

  >svg {
      width:0.85rem;
      height:0.85rem;
      color: var(--blue-twitter);
      margin-left:5px;
      top:5px;
      cursor:pointer;

      &:hover {
        color: var(--orange);
      }
  }

  header {
    top:0;
    font-size: 0.765rem;
    margin-top:-50px;
    margin-bottom:1rem;
    padding: 1rem;
    font-weight:400;
    text-align:center;
    border-bottom: 1px solid var(--gray);
  }

  label {
        font-size: 0.675rem;
        color: var(--primary);
        display: flex;
        flex-direction: column;

        &:focus-within {
          color: var(--orange);

          &.required{
          color: var(--red);
          }
        }

        p{
          display: flex;
          align-items: center;

          svg {
            color: var(--green);
            margin-left: 0.5rem;
            width: 1rem;
            height: 1rem;
          }
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

        > svg {
                width:1rem;
                height:1rem;
                color:var(--blue-twitter);
                cursor:pointer;
                float: right;
                margin-right: -25px;
                margin-top: -30px;

                &:hover {
                    color: var(--orange);
                }
            }

      }

  .waiting {
      text-align: center;
      color: var(--blue-twitter);
  }

  footer {
    text-align:center;
  }

  > div {
    justify-content:center;
    text-align:center;
  }
`;

