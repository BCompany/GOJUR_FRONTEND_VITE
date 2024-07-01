import styled from 'styled-components'

export const Container = styled.div`
    margin-top:10px;
    min-height: 20rem;
    margin-right:0.7rem;
    margin-bottom:2rem;

    .waiting {
        text-align: center;
        color: var(--blue-twitter);
    }

    footer {
        display:flex;
        justify-content: end;
        margin-bottom:0.5rem;
        margin-right:1rem;
    }
`;

export const Content = styled.div `
    margin:0rem 0rem;

    @media (min-width: 480px) {
      margin:0.5rem 7rem;
    }

    footer {
        display:flex;
        justify-content: start;
        margin-bottom:0.5rem;
    }

    header {
        overflow: hidden;
        text-align: center;
        font-size:0.7rem;
        font-weight:500;
        margin-bottom:5px;
    }

    header:before,
    header:after {
        background-color: rgba(0,0,0,0.15);
        content: "";
        display: inline-block;
        height: 1px;
        position: relative;
        vertical-align: middle;
        width: 50%;
    }

    header:before {
        right: 0.5em;
        margin-left: -50%;
    }

    header:after {
        left: 0.5em;
        margin-right: -50%;
    }

    section {

      width:100%;
      display:flex;
      flex:1;
      column-gap:1.5rem;
      justify-content: space-around;

      >  label {

          flex:1;
          font-size: 0.675rem;
          color: var(--primary);
          margin:0.3rem;

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

      .comboPerson {
        flex: 55%
      }

      .comboType {
        flex:35%
      }

      .checkMain {
        flex:5%;
        min-width:1rem;
        input {
            cursor: pointer;
            margin-top:0.7rem;
            margin-left:1.2rem;
        }
      }

      .erroMessage {
        width:1rem;
        height:1rem;
        color:var(--blue-twitter);
        cursor:pointer;
        &:hover {
            color: var(--orange);
        }
      }
}
`
