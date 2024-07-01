import React, { useState, useCallback, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { FaFacebookSquare, FaInstagram } from "react-icons/fa";

import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { useAuth } from "context/AuthContext";
import { useToast } from "context/toast";
import { envProvider } from "services/hooks/useEnv";
import i18n from "translate/i18n";
import Input from "components/Input";
import ButtonLoginScreen from "components/Buttons/ButtonLoginScreen";

import {
  Container,
  Aside,
  HeaderSide,
  ContentSide,
  Contrate,
  FooterSide,
  Socials,
  MainContent,
} from "./styles";

interface Inputs {
  email: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const { signIn, name } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  const { handleSubmit, control } = useForm<Inputs>();

  const I18N_STORAGE_KEY = "i18nextLng";

  const [language, setLanguage] = useState(
    localStorage.getItem(I18N_STORAGE_KEY)
  );

  const handleLanguages = useCallback(
    (event: { target: { value: string } }) => {
      localStorage.setItem(I18N_STORAGE_KEY, event.target.value);

      window.location.reload();
    },
    []
  );

  const onSubmit = useCallback(
    async (data: Inputs) => {
      try {
        const schema = Yup.object().shape({
          email: Yup.string().required("E-mail ou Usuário é obrigatório"),
          password: Yup.string().required("Senha é obrigatório"),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        // LOGIN USER
        await signIn({ email: data.email, password: data.password });

        addToast({
          type: "success",
          title: "Autenticação Concluida",
          description: `Seja bem vindo!`,
        });

        // const userType= localStorage.getItem('@GoJur:tpoUser');
        // if (userType === 'C'){

        //   return;
        // }

        localStorage.setItem("@GoJur:LoginType", "N");
        localStorage.setItem("@GoJur:firstPage", "S");

        history.push("/clientRedirect");
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          addToast({
            type: "error",
            title: "Erro na autenticação",
            description: "O Email e a Senha são campos obrigatórios",
          });
          return;
        }
        addToast({
          type: "error",
          title: "Erro na autenticação",
          description: err.response.data.Message,
        });
      }
    },
    [signIn, addToast, history]
  );

  return (
    <Container>
      <Aside>
        <HeaderSide>
          <a href="https://www.bcompany.com.br/">
            <img
              src={`${envProvider.mainUrl}/assets/logo-bcompany.png`}
              alt="Business Company"
            />
          </a>
          <div>
            <h1>{i18n.t("titles.welcome")}</h1>
            <p>{i18n.t("titles.slogan")}</p>
          </div>
        </HeaderSide>

        <ContentSide>
          <p>
            Somos uma empresa de tecnologia com mais de 20 anos de atuação no
            mercado, especificamente nas áreas de desenvolvimento de software e
            banco de dados. Atuamos exclusivamente no segmento jurídico há mais
            de 12 anos através da oferta de soluções de software, serviços e
            suporte.
            <br />
            <br />
            Prestamos um papel importante no apoio as atividades de nossos
            clientes que são compostos em sua maioria por escritórios de
            advocacia, departamentos jurídicos de empresas, imobiliárias e
            escritórios de cobrança.
          </p>
          <Contrate>
            <a href="https://www.bcompany.com.br/planos/">Contrate Agora</a>
          </Contrate>
        </ContentSide>
        <FooterSide>
          <Socials>
            <a href="https://www.facebook.com/GOJUR-737062343067100">
              <FaFacebookSquare />
            </a>
            <a href="https://instagram.com/bc.gojur?igshid=jkjfo5a9crrh">
              <FaInstagram />
            </a>
            {/* <a href="https://web.whatsapp.com/send?phone=+551100000000?text=Olá,">
              <FaWhatsapp />
            </a> */}
            {/* <FaLinkedin /> */}
          </Socials>
          <a href="https://www.bcompany.com.br/politicas-de-privacidade/">
            Privacidade
          </a>
          <a href="https://www.bcompany.com.br/termos-de-servico/">
            Termos de Serviço
          </a>
        </FooterSide>
      </Aside>
      <MainContent>
        <select onChange={handleLanguages}>
          <option>Selecione um idioma</option>
          <option value="pt-BR">PT</option>
          <option value="en-US">EN</option>
        </select>

        <img src={`${envProvider.mainUrl}/assets/logo-gojur.png`} alt="GoJur" />
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
