import React, { useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft, FiMail } from 'react-icons/fi';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { useToast } from 'context/toast';
import api from 'services/api';
import { envProvider } from 'services/hooks/useEnv';

import ButtonLoginScreen from 'components/Buttons/ButtonLoginScreen';
import Input from 'components/Input';
// import LogoBCompany from '../../assets/logo-bcompany.png';
// import ForgotPassword from '../../assets/forgot-password.png';

import { Container, Aside, HeaderSide, Content, ImgBackground } from './styles';

interface Inputs {
  email: string;
}

const ForgotPasswordDesktopScreen: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { handleSubmit, control } = useForm<Inputs>();

  const onSubmit = useCallback(
    async (data: Inputs) => {
      try {
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail é obrigatório')
            .email('Digite um email válido'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        // Recuperar senha
        await api.post('/Usuario/RecuperarSenha', {
          email: data.email,
        });

        addToast({
          type: 'success',
          title: 'Recuperação de senha',
          description:
            'Enviamos um e-mail para concluirmos a recuperação de senha, cheque sua caixa de email',
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          addToast({
            type: 'error',
            title: 'Erro na recuperação de senha',
            description:
              'Ocorreu um erro ao tentar fazer a recuperação de senha, tente novamente',
          });
        }
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Aside>
        <HeaderSide>
          <a href="https://www.bcompany.com.br/">
            <img src={`${envProvider.mainUrl}/assets/logo-bcompany.png`} alt="B Company" />
          </a>
          <div>
            <h1>Seja bem vindo ao GoJur</h1>
            <p>O seu software júridico</p>
          </div>
        </HeaderSide>

        <Content>
          <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
            <h1>Recuperar senha</h1>

            <Controller
              style={{ color: '#fff' }}
              as={Input}
              name="email"
              control={control}
              defaultValue=""
              placeholder="E-mail para recuperação de senha"
              className="Input"
              icon={FiMail}
            />

            <ButtonLoginScreen type="submit">Recuperar</ButtonLoginScreen>
          </form>
        </Content>

        <Link to="/">
          <FiArrowLeft />
          Voltar para o login
        </Link>
      </Aside>
      <ImgBackground src={`${envProvider.mainUrl}/assets/forgot-password.png`} alt="Forgot" />
    </Container>
  );
};

export default ForgotPasswordDesktopScreen;
