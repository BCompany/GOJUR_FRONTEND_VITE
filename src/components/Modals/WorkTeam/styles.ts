import styled from 'styled-components';

export const Container = styled.div`
 display: flex;
 align-items: center;
 justify-content: center;
 width: 100%;
 flex-direction: column;

 > header {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    color: var(--grey);

    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: 0.3s all;
    font-size: 0.875rem;
    padding: 1rem;
    font-family: montserrat;
    font-weight: normal;
    font-size: 0.75rem;
    line-height: 1.2px;
    padding: 20px;

    > div {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0.5rem;

      > button {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        > svg {
          width: 20px;
          height: 20px;
          color: var(--blue-light);
          margin-left: 8px;
          margin-right: 8px;
        }

        &:hover {
          background-color: rgba(0, 0, 0, 0.05);

          > svg {
            color: var(--orange);
          }
        }
      }

      > p {
        font-size: 0.875rem;
        font-family: Montserrat;
      }
    }
  }
`;

export const IncludeWorkTeamStyle = styled.div`
  width: 200px;

  button {
      display: flex;
      align-items: center;
      justify-content: center;
      /* background-color: var(--blue); */
      position: relative;
      padding: 0 0.5rem;
      > svg {
        width: 2rem;
        height: 2rem;
        color: var(--blue);
      }

      &:hover {
        > svg {
          color: var(--orange);
        }
      }
    }
    
    .buttonCheckBox {

      padding: 0.4rem;
      border-radius: 0.25rem;
      font-family: Montserrat;
      font-size: 0.7rem;
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
`;

export const WorkTeamForm = styled.form`
  width: 80%;
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
  }
`;