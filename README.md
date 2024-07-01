<h1 align="center">
GoJur - Software
</h1>

<p align="center">Instruções básicas para execução do projeto</p>

<hr>

## Dependencias

1. Node Js - versão 20 LTS
2. Yarn ou NPM

## Instalação

1. Baixe o projeto.<br />
2. Acesse o diretório do projeto e abra o mesmo no VScode.
3. Execute o comando yarn ou npm install no terminal integrado do VScode.
4. Após concluido a instalação dos pacotes do projeto, crie na raiz do projeto
   um arquivo .env para setar as variaveis ambiente.
5. Rode `yarn dev` para subir o servidor localmente
6. Rode `yarn build` para gerar os arquivos de produção.

## Variaveis Ambientes

REACT_APP_ENVIROMENT= 'DEVELOPMENT' ⇒ Ambiente que a aplicação esta executando

REACT_APP_BASE_URL_API= 'http://homoapi.gojur.com.br' ⇒ URL Base para as chamadas a api

REACT_APP_BASE_URL_REDIRECT= 'https://homo.gojur.com.br/' ⇒ Base URL para redirects da navegação
