import InputMask from 'components/InputMask';
import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: auto;
  font-size: 12px;
  background-color: #FFFFFF;
`;

export const Center = styled.div`
  .flex-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .container-box {
    background-color: #FFFFFF;
  }

  .content-box {
    text-align: center;
    width: 60%;
  }
`;

export const OverlaySubscriber = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;

  .message {
    position: absolute;
    background: var(--yellow);
    box-shadow: 2px 2px 2px 2px rgb(0 0 0 / 40%);
    border-radius: 0.25rem;
    text-align: center;
    font-size: 0.7rem;
    font-weight: 400;
    color: var(--blue-twitter);
    font-family: Montserrat;
    padding: 0.5rem 0.5rem;
    margin-right: 1.7rem;
    margin-bottom: 1px;
    cursor: pointer;
    z-index: 999999;
    min-width: 10rem;
    margin-top: 22%;
    margin-left: 38%;
    bottom: 50%;
    right: 30%;
  }
`;

export const ModalAlert = styled.div`
  border: 1px solid var(--blue-twitter);
  font-size: 0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width: 570px;
  min-height: 14rem;
  max-height: 14rem;
  overflow: auto;
  background-color: var(--white);
  position: absolute;
  z-index: 99999;
  justify-content: center;
  margin-left: 30%;
  margin-top: 10%;

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

export const Header = styled.div`
  background-color: #285776;
  width: 100%;
  height: 50px;
`;

export const Phones = styled.div`
  float: right;
  margin-top: 15px;
  margin-right: 50px;
`;

export const Phone = styled.div`
  float: left;
  width: 130px;
`;

export const PhoneImg = styled.div`
  float: left;
  margin-top: 1px;
`;

export const PhoneNumber = styled.label`
  float: left;
  color: #FFF;
  font-size: 12px;
  font-family: sans-serif;
`;

export const Email = styled.div`
  float: left;
  width: 200px;
`;

export const EmailImg = styled.div`
  float: left;
`;

export const EmailDesc = styled.label`
  float: left;
  color: #FFF;
  font-size: 12px;
  font-family: sans-serif;
`;

export const LogoTitle1 = styled.div`
  width: 100%;
  background-color: #f5f5f5;
  height: 100px;
`;

export const LogoTitle2 = styled.div`
  width: 100%;
  background-color: #f5f5f5;
  height: 100px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const BCompanyLogo = styled.div`
  width: 55%;
`;

export const BCompanyTitle = styled.label`
  color: #000;
  font-size: 24px;
  font-family: sans-serif;
`;

export const CenteredContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const InnerContainer = styled.div`
  width: 55%;
`;

export const DescriptionText = styled.p`
  color: #929292;
  font-size: 14px;
  font-family: sans-serif;
  line-height: 1.8;
  text-align: justify;
  max-height: 100px;
`;

export const InputLabel = styled.label`
  color: #929292;
  font-size: 14px;
  font-family: sans-serif;
`;

export const InputField = styled.input`
  width: 100%;
  min-height: 40px;
  font-size: 14px;
  line-height: 1.8;
  padding: 6px 12px;
  vertical-align: middle;
  color: #333;
  border: solid 1px #ddd;
  border-radius: 3px;
`;

export const SelectField = styled.select`
  width: 100%;
  min-height: 40px;
  font-size: 14px;
  line-height: 1.8;
  padding: 6px 12px;
  vertical-align: middle;
  color: #333;
  border: solid 1px #ddd;
  border-radius: 3px;
`;

export const CheckboxLabel = styled.label`
  color: #929292;
  font-size: 14px;
  font-family: sans-serif;
`;

export const Link = styled.a`
  color: #285776;
  font-size: 14px;
  font-family: sans-serif;
  text-decoration: none;
`;

export const ConfirmButton = styled.input`
  font-size: 14px;
  padding: 10px 20px;
  font-weight: 600;
  font-family: sans-serif;
  color: #FFFFFF;
  background: #C2D138;
  border: 0px;
  border-radius: 50px;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  width: 223px;
`;

export const Footer = styled.div`
  width: 100%;
  background-color: #285776;
  height: 50px;
`;

export const ModalHeader = styled.div`
  height: 30px;
  font-weight: 600;
`;

export const ModalContent = styled.div`
  margin-left: 20px;
`;

export const ModalButton = styled.button`
  float: left;
  margin-left: 240px;
  width: 100px;
`;
