import { MultiSelect } from 'react-multi-select-component';
import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 4rem;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  #filter {
    display: flex;
    margin-top: 0;
  }

  .select {
    margin-left: 0.5rem;
    font-size: 0.675rem;
    width: 15rem;
    border-radius: 25px;
  }

  #tipMesssage {
    background: transparent;
    color: var(--blue);
    width: 3rem;
    height: 3rem;
    margin-left: 0.3rem;
    color: var(--blue-twitter);
    cursor: pointer;
  }

  .flash {
    animation-name: flash;
    animation-duration: 2s;
    animation-iteration-count: infinite;
  }

  @keyframes flash {
    0% {
      color: var(--blue-twitter);
    }
    50% {
      color: orange;
    }

    100% {
      color: var(--blue-twitter);
    }
  }

  .preview {
    background: var(--blue-twitter);
    color: #fff;
    width: 200px;
    position: relative;
    text-align: center;
    font-size: 16px;
    font-family: Montserrat;
  }

  .preview .btn {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    bottom: 0;
    position: absolute;
    font-family: Montserrat;
  }
  .btn button {
    width: 100%;
    height: 42px;
    color: var(--blue-twitter);
    font-size: 13px;
    font-weight: 500;
    border: none;
    outline: none;
    border-radius: 8px;
    cursor: pointer;
    -webkit-transition: all 0.3s ease;
    transition: all 0.3s ease;
    border-radius: 5px solid orange;
    color: white;
    background: orange;
    font-family: Montserrat;
  }

  .btn button:hover {
    border-radius: 5px;
    background: orange;
    color: #fff;
  }
`;


export const ContainerMobile = styled.div`
  width: 100%;
  height: 4rem;
  padding: 0 1rem;
  align-items: center;
  justify-content: space-between;

  #filter {
    display: flex;
    margin-top: 0;
  }

  .select {
    margin-left: 0.5rem;
    font-size: 0.675rem;
    width: 15rem;
    /* z-index:9990; */
    border-radius: 25px;
  }

  #tipMesssage {
    background: transparent;
    color: var(--blue);
    width: 2rem;
    height: 2rem;
    margin-left: 0.3rem;
    color: var(--blue-twitter);
    cursor: pointer;
  }

  /* .btn {
    width: 120px;
    background-color: var(--blue-twitter);
    border: none;
    color: #fff;
    padding: 12px 15px;
    border-radius: 5px;
    margin-right: 10px;
  } */

  .flash {
    animation-name: flash;
    animation-duration: 2s;
    animation-iteration-count: infinite;
  }

  @keyframes flash {
    0% {
      color: var(--blue-twitter);
    }
    50% {
      color: orange;
    }

    100% {
      color: var(--blue-twitter);
    }
  }

  .preview {
    background: var(--blue-twitter);
    color: #fff;
    width: 200px;
    position: relative;
    text-align: center;
    font-size: 16px;
    font-family: Montserrat;
  }

  .preview .btn {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    bottom: 0;
    position: absolute;
    font-family: Montserrat;
  }
  .btn button {
    width: 100%;
    height: 42px;
    color: var(--blue-twitter);
    font-size: 13px;
    font-weight: 500;
    border: none;
    outline: none;
    border-radius: 8px;
    cursor: pointer;
    -webkit-transition: all 0.3s ease;
    transition: all 0.3s ease;
    border-radius: 5px solid orange;
    color: white;
    background: orange;
    font-family: Montserrat;
  }

  .btn button:hover {
    border-radius: 5px;
    background: orange;
    color: #fff;
  }
`;


export const Multi = styled(MultiSelect)`
  font-size: 0.7rem;
  background-color: var(--white);
  color: var(--primary);
  margin-right: 5px;

  .dropdown-heading {
    width: 13vw;
    height: 1.6rem;
  }

  &::placeholder {
    color: var(--primary);
  }

  &:focus {
    border: none;
  }
`;


export const User = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  top: -8px;
  margin-top: 20px;

  p {
    margin-left: 0.5rem;
    font-size: 0.75rem;
    font-family: Montserrat;
    color: var(--orange);
  }
`;


export const Avatar = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 1px solid var(--blue-twitter);
  transition: opacity 0.5s;

  &:hover {
    opacity: 0.35;
    border: 2px solid var(--blue-twitter);
    cursor: pointer;
  }
`;
