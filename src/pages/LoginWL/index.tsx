import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';

import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { useAuth } from 'context/AuthContext';
import { useToast } from 'context/toast';
import i18n from 'translate/i18n';

import Input from 'components/Input';
import ButtonLoginScreen from 'components/Buttons/ButtonLoginScreen';
import LogoGoJur from '../../assets/logo-gojur.png';

import { Container, MainContent } from './styles';

interface Inputs {
  email: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const { signIn } = useAuth();
  const history = useHistory();
  const { addToast } = useToast();

  const location = useLocation();

  const { handleSubmit, control } = useForm<Inputs>();

  const I18N_STORAGE_KEY = 'i18nextLng';

  const [language, setLanguage] = useState(
    localStorage.getItem(I18N_STORAGE_KEY),
  );

  const [logo, setLogo] = useState('');

  useEffect(() => {
    const errorMesage = location.search.split('&')[1].substr(8);
    addToast({
      type: 'error',
      title: 'Erro na autenticação',
      description: decodeURI(errorMesage),
    });

    const logoImg = location.search.split('&')[0].substr(6);

    setLogo(logoImg);
  }, [addToast, location]);
  const handleLanguages = useCallback(event => {
    localStorage.setItem(I18N_STORAGE_KEY, event.target.value);

    window.location.reload();
  }, []);

  const onSubmit = useCallback(
    async (data: Inputs) => {
      try {
        const schema = Yup.object().shape({
          email: Yup.string().required('E-mail ou Usuário é obrigatório'),
          password: Yup.string().required('Senha é obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          email: data.email,
          password: data.password,
        });
        addToast({
          type: 'success',
          title: 'Autenticação Concluida',
          description: `Seja bem vindo!`,
        });

        history.push('/clientRedirect');
      } catch (err:any) {
        if (err instanceof Yup.ValidationError) {
          addToast({
            type: 'error',
            title: 'Erro na autenticação',
            description: 'O Email e a Senha são campos obrigatórios',
          });
          return;
        }
        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: err.response.data.Message,
        });
      }
    },
    [signIn, addToast, history],
  );

  return (
    <Container>
      <MainContent>
        <select onChange={handleLanguages}>
          <option>Selecione um idioma</option>
          <option value="pt-BR">PT</option>
          <option value="en-US">EN</option>
        </select>

        {logo.length === 0 ? (
          <img
            src={LogoGoJur}
            style={{ width: '23.75rem', height: '9.75rem' }}
            alt="Go Jur"
          />
        ) : (
          <img src={logo} alt="Go Jur" />
        )}
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
          <h2>Login</h2>

          <Controller
            as={Input}
            name="email"
            control={control}
            defaultValue=""
            placeholder="E-mail ou Usuário"
            className="Input"
            type="text"
            icon={FiMail}
          />
          <Controller
            as={Input}
            name="password"
            control={control}
            defaultValue=""
            placeholder="Senha"
            className="Input"
            type="password"
            icon={FiLock}
          />

          <ButtonLoginScreen type="submit">Acessar</ButtonLoginScreen>
        </form>
        <Link to="/forgot">Esqueci minha senha</Link>
      </MainContent>
    </Container>
  );
};

export default LoginScreen;
