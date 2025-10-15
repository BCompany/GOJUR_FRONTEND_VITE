/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */
/* eslint-disable react/jsx-one-expression-per-line */

import React, { useState, ChangeEvent, useCallback, useEffect } from 'react';
import api from 'services/api';
import { useDevice } from "react-use-device";
import { FaCheck } from 'react-icons/fa';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import InputMask from 'components/InputMask';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Header,
  Phones,
  Phone,
  PhoneImg,
  PhoneNumber,
  Email,
  EmailImg,
  EmailDesc,
  CenteredContainer,
  InnerContainer,
  DescriptionText,
  InputLabel,
  InputField,
  SelectField,
  CheckboxLabel,
  Link,
  ConfirmButton,
  Footer,
  ModalHeader,
  ModalContent,
  ModalButton,
  ModalAlert,
  OverlaySubscriber
} from './styles';
import { set } from 'date-fns';

const Subscriber: React.FC = () => {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [chanel, setChanel] = useState<string>('')
  const [checkTerm, setCheckTerm] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasError, setHasError] = useState<boolean>(false)
  const [errorName, setErrorName] = useState<string>('')
  const [errorEmail, setErrorEmail] = useState<string>('')
  const [errorPassword, setErrorPassword] = useState<string>('')
  const [errorPhone, setErrorPhone] = useState<string>('')
  const [errorChanel, setErrorChanel] = useState<string>('')
  const [errorTerm, setErrorTerm] = useState<string>('')
  const [genericError, setGenericError] = useState<string>('')
  const [plan, setPlan] = useState<string>('GOJURFR')
  const [showOthersField, setShowOthersField] = useState(false);
  const [otherText, setOtherText] = useState('');
  const location = useLocation();
  const { isMOBILE } = useDevice()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get('plan');
    if (planParam) {
      setPlan(planParam.toUpperCase());
    }
  }, []);

  const validateFields = () => {
    let error = false;

    if (name === '') {
      setErrorName('O campo Escritório ou empresa deve ser preenchido.');
      error = true;
    }

    if (email === '') {
      setErrorEmail('O campo Email deve ser preenchido.');
      error = true;
    }

    if (password === '') {
      setErrorPassword('O campo Senha deve ser preenchido.');
      error = true;
    }

    if (phone === '') {
      setErrorPhone('O campo Telefone deve ser preenchido.');
      error = true;
    }

    if (chanel === '') {
      setErrorChanel('O campo Como nos conheceu deve ser preenchido.');
      error = true;
    }

    if (checkTerm === 'N' || checkTerm === '') {
      setErrorTerm('Favor confirmar que concorda com nossos termos.');
      error = true;
    }

    setHasError(error);
    return !error;
  };

  const saveSubscriber = useCallback(async () => {
    try {
      if (!validateFields()) return;

      setIsLoading(true);

      const response = await api.post('/Subscriber/Salvar', {
        name,
        email,
        password,
        phone,
        chanel,
        plan
      });

      window.open(`/newFirstAccess?token=${response.data.token}`, '_parent');
    } catch (err: any) {
      setIsLoading(false);
      setHasError(true);
      setGenericError(err.response.data.Message);
    }
  }, [name, email, password, phone, chanel, checkTerm]);

  const CloseModal = () => {
    setHasError(false);
    setErrorName('');
    setErrorEmail('');
    setErrorPassword('');
    setErrorPhone('');
    setErrorChanel('');
    setErrorTerm('');
    setGenericError('');
  };

  return (
    <>
      {!isMOBILE && (
        <Container id='Container'>
          <Header>
            <Phones>
              <Phone>
                <PhoneImg>
                  <img alt='' src='https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/siteSubscribePhone.png' />
                </PhoneImg>
                <PhoneNumber>&nbsp;&nbsp;&nbsp;(11) 2626-0385</PhoneNumber>
              </Phone>
              <Phone>
                <PhoneImg>
                  <img alt='' src='https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/siteSubscribePhone.png' />
                </PhoneImg>
                <PhoneNumber>&nbsp;&nbsp;&nbsp;(21) 3005-3149</PhoneNumber>
              </Phone>
              <Email>
                <EmailImg>
                  <img alt='' src='https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/siteSubscribeEmail.png' />
                </EmailImg>
                <EmailDesc>&nbsp;&nbsp;&nbsp;suporte@bcompany.com.br</EmailDesc>
              </Email>
            </Phones>
          </Header>
          <br /><br />

          <div style={{ width: '100%', backgroundColor: '#f5f5f5', height: '100px' }}>
            <div style={{ width: '100%', backgroundColor: '#f5f5f5', height: '100px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ width: '55%' }}>
                <div style={{ marginTop: '-35px' }}>
                  <a href="https://www.bcompany.com.br/">
                    <img alt='' src='https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/siteSubscribeLogoBCompany.png' />
                  </a>
                </div>
                <div style={{ marginTop: '-65px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <label style={{ color: '#000', fontSize: '24px', fontFamily: 'sans-serif' }}>Assinar Software Jurídico GOJUR</label>
                </div>
              </div>
            </div>
          </div>
          <br /><br />

          <CenteredContainer>
            <InnerContainer>
              <img alt='' src='https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/siteSubscribeLogoGojur.png' />
              <br /><br />
              <DescriptionText>
                Inicie sua experiência agora com o software jurídico GOJUR fornecendo as informações abaixo.<br />
                Após confirmar sua assinatura, você será direcionado para a página inicial do software e pode começar a usar na mesma hora.
              </DescriptionText>
              <br />
              <DescriptionText>
                <b>Aguarde um minuto até criarmos sua conta.</b> Você será redirecionado para o software após o término.
              </DescriptionText>
              <br /><br />

              <InputLabel>Escritório ou empresa</InputLabel><br />
              <InputField
                maxLength={50}
                type="text"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                autoComplete="off"
              />
              <br /><br />

              <InputLabel>Email</InputLabel><br />
              <InputField
                maxLength={50}
                type="text"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                autoComplete="off"
              />
              <br /><br />

              <InputLabel>Senha - de 6 a 15 caracteres</InputLabel><br />
              <InputField
                maxLength={15}
                type="text"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                autoComplete="off"
              />
              <br /><br />

              <InputLabel>Telefone</InputLabel><br />
              <InputMask
                maxLength={50}
                type="text"
                autoComplete="off"
                title="Formato esperado 11 99999-9999"
                mask="tel"
                value={phone}
                style={{ width: '100%', minHeight: '40px', fontSize: '14px', lineHeight: '1.8', padding: '6px 12px', verticalAlign: 'middle', color: '#333', border: 'solid 1px #ddd', borderRadius: '3px' }}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
              />
              <br />

              <InputLabel>Plano</InputLabel><br />
              <SelectField
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setPlan(e.target.value)}
                value={plan}
              >
                <option value="GOJURFR">PLANO FREE</option>
                <option value="GOJURLT">PLANO LIGHT</option>
                <option value="GOJURSM">PLANO SMART</option>
                <option value="GOJURES">PLANO ESSENTIAL</option>
                <option value="GOJURTP">PLANO TOP</option>
                <option value="GOJURUS">PLANO USUÁRIO</option>
              </SelectField>
              <br /><br />

              <InputLabel>Como nos conheceu ?</InputLabel><br />
              <SelectField
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  setChanel(e.target.value);
                  setShowOthersField(e.target.value==="Outros");
                }
                }
              >
                <option value="0">Como nos conheceu?</option>
                <option value="Google, Yahoo, Bing">Google, Yahoo, Bing</option>
                <option value="Facebook/Instagram">Facebook/Instagram</option>
                <option value="CAASP-OAB">CAASP-OAB</option>
                <option value="MentoriaLorena">MentoriaLorena</option>
                <option value="Outros">Outros</option>
              </SelectField>
              <br /><br />

              {showOthersField && (
                <>
              <InputLabel>Nos conte mais ou insira ou insira seu cupom</InputLabel><br />
              <InputField
                maxLength={50}
                type="text"
                value={otherText}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setOtherText(e.target.value)}
                autoComplete="off"
              />
              </>
              )}

              <br /><br />
              <input
                type="checkbox"
                checked={checkTerm == 'S'}
                onChange={(e) => setCheckTerm((e.target.checked) ? 'S' : 'N')}
                autoComplete="off"
              />&nbsp;&nbsp;
              <CheckboxLabel>Concordo com os </CheckboxLabel>
              <Link href="termos-de-servico" target="_blank">termos de serviço</Link>
              <CheckboxLabel> e </CheckboxLabel>
              <Link href="politicas-de-privacidade" target="_blank">política de privacidade</Link>.
              <br /><br />

              <ConfirmButton
                value="Confirmar Assinatura"
                onClick={() => saveSubscriber()}
              />

              <br /><br /><br /><br /><br /><br />
            </InnerContainer>
          </CenteredContainer>

          <Footer>
            <div style={{ height: '50px' }}>
              &nbsp;
            </div>
          </Footer>

          {hasError && <Overlay />}
          {hasError && (
            <ModalAlert id='ModalAlert'>
              <ModalHeader>
                <div className='menuTitle'>
                  &nbsp;&nbsp;&nbsp;&nbsp;ATENÇÃO
                </div>
                <div className='menuSection'>
                  &nbsp;
                </div>
              </ModalHeader>
              <br />

              <ModalContent>
                {errorName}{errorName != '' ? <br /> : ''}
                {errorEmail}{errorEmail != '' ? <br /> : ''}
                {errorPassword}{errorPassword != '' ? <br /> : ''}
                {errorPhone}{errorPhone != '' ? <br /> : ''}
                {errorChanel}{errorChanel != '' ? <br /> : ''}
                {errorTerm}{errorTerm != '' ? <br /> : ''}
                <br /><br />
              </ModalContent>
              <ModalButton className="buttonClick" type='button' onClick={() => CloseModal()}>
                <FaCheck />
                Ok
              </ModalButton>
              <br /><br />
            </ModalAlert>
          )}

          {isLoading && (
            <>
              <OverlaySubscriber />
              <div style={{ position: 'absolute', marginLeft: '37%', marginTop: '20%', background: 'var(--yellow)', boxShadow: '2px 2px 2px 2px rgb(0 0 0 / 40%)', borderRadius: '0.25rem', fontSize: '0.7rem', fontWeight: 600, color: 'var(--blue-twitter)', fontFamily: 'Montserrat', padding: '0.5rem 0.5rem', zIndex: 9 }}>
                <LoaderWaiting size={15} color="var(--blue-twitter)" />
                &nbsp;&nbsp;Aguarde enquanto estamos criando a sua conta no GOJUR
              </div>
            </>
          )}
        </Container>
      )}

      {isMOBILE && (
        <Container id='Container'>
          <div id='Header' style={{ backgroundColor: '#285776', width: '100%', height: '60px' }}>
            <div id='Phones' style={{ float: 'right', marginTop: '15px', marginRight: '50px' }}>
              <div id='PhoneSP' style={{ float: 'left', width: '130px', marginLeft: '50px' }}>
                <div id='PhoneSPImg' style={{ float: 'left', marginTop: '1px' }}>
                  <img alt='' src='https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/siteSubscribePhone.png' />
                </div>
                <div id='PhoneSPNumber' style={{ float: 'left' }}><label style={{ color: '#FFF', fontSize: '12px', fontFamily: 'sans-serif' }}>&nbsp;&nbsp;&nbsp;(11) 2626-0385</label></div>
              </div>
              <div id='PhoneRJ' style={{ float: 'left', width: '130px' }}>
                <div id='PhoneRJImg' style={{ float: 'left', marginTop: '1px' }}>
                  <img alt='' src='https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/siteSubscribePhone.png' />
                </div>
                <div id='PhoneRJNumber' style={{ float: 'left' }}><label style={{ color: '#FFF', fontSize: '12px', fontFamily: 'sans-serif' }}>&nbsp;&nbsp;&nbsp;(21) 3005-3149</label></div>
              </div>
              <div id='EMail' style={{ float: 'left', width: '200px', marginLeft: '85px' }}>
                <div id='EMailImg' style={{ float: 'left' }}>
                  <img alt='' src='https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/siteSubscribeEmail.png' />
                </div>
                <div id='EMailDesc' style={{ float: 'left' }}><label style={{ color: '#FFF', fontSize: '12px', fontFamily: 'sans-serif' }}>&nbsp;&nbsp;&nbsp;suporte@bcompany.com.br</label></div>
              </div>
            </div>
          </div>

          <div id='LogoTitle1' style={{ width: '100%', backgroundColor: '#f5f5f5', height: '100px' }}>
            <div id='LogoTitle2' style={{ width: '100%', backgroundColor: '#f5f5f5', height: '100px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <div id='BCompanyLogo' style={{ float: 'left', width: '30%', marginLeft: '30px' }}>
                <a href="https://www.bcompany.com.br/">
                  <img alt='' src='https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/siteSubscribeLogoBCompany.png' />
                </a>
              </div>
              <div id='BCompanyTitle' style={{ float: 'left', width: '70%', marginLeft: '10px' }}>
                <label style={{ color: '#000', fontSize: '24px', fontFamily: 'sans-serif' }}>Assinar Software Jurídico GOJUR</label>
              </div>
            </div>
          </div>
          <br />

          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '80%' }}>
              <div>
                <div style={{ textAlignLast: 'center' }}>
                  <img alt='' src='https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/siteSubscribeLogoGojur.png' />
                </div>
                <br /><br />
                <p style={{ color: '#929292', fontSize: '14px', fontFamily: 'sans-serif', lineHeight: '1.8', textAlign: 'justify', maxHeight: '100px' }}>
                  Inicie sua experiência agora com o software jurídico GOJUR fornecendo as informações abaixo.<br />
                  Após confirmar sua assinatura, você será direcionado para a página inicial do software e pode começar a usar na mesma hora.
                </p>
                <br /><br /><br /><br />
                <p style={{ color: '#929292', fontSize: '14px', fontFamily: 'sans-serif', lineHeight: '1.8', textAlign: 'justify', maxHeight: '100px' }}>
                  <b>Aguarde um minuto até criarmos sua conta.</b> Você será redirecionado para o software após o término.
                </p>
                <br /><br />

                <label style={{ color: '#929292', fontSize: '14px', fontFamily: 'sans-serif' }}>Escritório ou empresa</label><br />
                <input
                  maxLength={50}
                  type="text"
                  value={name}
                  style={{ width: '100%', minHeight: '40px', fontSize: '14px', lineHeight: '1.8', padding: '6px 12px', verticalAlign: 'middle', color: '#333', border: 'solid 1px #ddd', borderRadius: '3px' }}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  autoComplete="off"
                />
                <br /><br />

                <label style={{ color: '#929292', fontSize: '14px', fontFamily: 'sans-serif' }}>Email</label><br />
                <input
                  maxLength={50}
                  type="text"
                  value={email}
                  style={{ width: '100%', minHeight: '40px', fontSize: '14px', lineHeight: '1.8', padding: '6px 12px', verticalAlign: 'middle', color: '#333', border: 'solid 1px #ddd', borderRadius: '3px' }}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  autoComplete="off"
                />
                <br /><br />

                <label style={{ color: '#929292', fontSize: '14px', fontFamily: 'sans-serif' }}>Senha - de 6 a 15 caracteres</label><br />
                <input
                  maxLength={15}
                  type="text"
                  value={password}
                  style={{ width: '100%', minHeight: '40px', fontSize: '14px', lineHeight: '1.8', padding: '6px 12px', verticalAlign: 'middle', color: '#333', border: 'solid 1px #ddd', borderRadius: '3px' }}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  autoComplete="off"
                />
                <br /><br />

                <label style={{ color: '#929292', fontSize: '14px', fontFamily: 'sans-serif' }}>Telefone</label><br />
                <InputMask
                  maxLength={50}
                  type="text"
                  autoComplete="off"
                  title="Formato esperado 11 99999-9999"
                  mask="tel"
                  value={phone}
                  style={{ width: '100%', minHeight: '40px', fontSize: '14px', lineHeight: '1.8', padding: '6px 12px', verticalAlign: 'middle', color: '#333', border: 'solid 1px #ddd', borderRadius: '3px' }}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                />
                <br /><br />

                <label style={{ color: '#929292', fontSize: '14px', fontFamily: 'sans-serif' }}>Como nos conheceu ?</label><br />
                <select
                  style={{ width: '100%', minHeight: '40px', fontSize: '14px', lineHeight: '1.8', padding: '6px 12px', verticalAlign: 'middle', color: '#333', border: 'solid 1px #ddd', borderRadius: '3px' }}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setChanel(e.target.value)}
                >
                  <option value="0">Informe como nos conheceu</option>
                  <option value="Google, Yahoo, Bing">Google, Yahoo, Bing</option>
                  <option value="Facebook/Instagram">Facebook/Instagram</option>
                  <option value="CAASP-OAB">CAASP-OAB</option>
                  <option value="MentoriaLorena">MentoriaLorena</option>
                  <option value="Outros">Outros</option>
                </select>
                <br /><br /><br />

                <input
                  type="checkbox"
                  checked={checkTerm == 'S'}
                  onChange={(e) => setCheckTerm((e.target.checked) ? 'S' : 'N')}
                  autoComplete="off"
                />&nbsp;&nbsp;
                <label style={{ color: '#929292', fontSize: '14px', fontFamily: 'sans-serif' }}>Concordo com os </label>
                <a href="termos-de-servico" style={{ color: '#285776', fontSize: '14px', fontFamily: 'sans-serif', textDecoration: 'none', }} target="_blank">termos de serviço</a>
                <label style={{ color: '#929292', fontSize: '14px', fontFamily: 'sans-serif' }}> e </label>
                <a href="politicas-de-privacidade" style={{ color: '#285776', fontSize: '14px', fontFamily: 'sans-serif', textDecoration: 'none', }} target="_blank">política de privacidade</a>.
                <br /><br /><br />

                <input
                  style={{ fontSize: '14px', padding: '10px 20px 10px 20px', fontWeight: 600, fontFamily: 'sans-serif', color: '#FFFFFF', background: '#C2D138', border: '0px', borderRadius: '50px 50px 50px 50px', textTransform: 'uppercase', textDecoration: 'none', cursor: 'pointer', width: '223px' }}
                  value="Confirmar Assinatura"
                  onClick={() => saveSubscriber()}
                />

                <br /><br /><br /><br />
              </div>
            </div>
          </div>

          <div style={{ width: '100%', backgroundColor: '#285776', height: '50px' }}>
            <div style={{ height: '50px' }}>
              &nbsp;
            </div>
          </div>

          {hasError && <Overlay />}
          {hasError && (
            <ModalAlert id='ModalAlert'>
              <div id='Header' style={{ height: '30px', fontWeight: 600 }}>
                <div className='menuTitle'>
                  &nbsp;&nbsp;&nbsp;&nbsp;ATENÇÃO
                </div>
                <div className='menuSection'>
                  &nbsp;
                </div>
              </div>
              <br />

              <div style={{ marginLeft: '20px' }}>
                {errorName}{errorName != '' ? <br /> : ''}
                {errorEmail}{errorEmail != '' ? <br /> : ''}
                {errorPassword}{errorPassword != '' ? <br /> : ''}
                {errorPhone}{errorPhone != '' ? <br /> : ''}
                {errorChanel}{errorChanel != '' ? <br /> : ''}
                {errorTerm}{errorTerm != '' ? <br /> : ''}
                <br /><br />
              </div>
              <div style={{ float: 'left', marginLeft: '240px' }}>
                <button className="buttonClick" type='button' onClick={() => CloseModal()} style={{ width: '100px' }}>
                  <FaCheck />
                  Ok
                </button>
              </div>
              <br /><br />
            </ModalAlert>
          )}

          {isLoading && (
            <>
              <OverlaySubscriber />
              <div style={{ position: 'absolute', marginLeft: '37%', marginTop: '20%', background: 'var(--yellow)', boxShadow: '2px 2px 2px 2px rgb(0 0 0 / 40%)', borderRadius: '0.25rem', fontSize: '0.7rem', fontWeight: 600, color: 'var(--blue-twitter)', fontFamily: 'Montserrat', padding: '0.5rem 0.5rem', zIndex: 9 }}>
                <LoaderWaiting size={15} color="var(--blue-twitter)" />
                &nbsp;&nbsp;Aguarde enquanto estamos criando a sua conta no GOJUR
              </div>
            </>
          )}
        </Container>
      )}
    </>
  );
};

export default Subscriber;