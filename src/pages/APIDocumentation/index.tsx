/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { Container, Center } from './styles';

const APIDocumentation = () => {
  const [swaggerSpec, setSwaggerSpec] = useState(null);
  const [filteredSpec, setFilteredSpec] = useState(null);
  const initialFilters = ['/Processo/Listar', '/Processo/SelecionarProcesso', '/ProcessoAcompanhamento/CriarAcompanhamentoWall', '/TipoAcompanhamento/Listar', '/ProcessoAcompanhamentos/Listar', '/Publicacao/Listar', '/Publicacao/ListarNomesPublicacao', '/Usuario/ListarUsuariosPorEmpresa'];


  useEffect(() => {
    const url = 'https://api.gojur.com.br/swagger/docs/v1';

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setSwaggerSpec(data);
        applyInitialFilters(data);
      });
  }, []);


  const applyInitialFilters = (data) => {
    const filteredPaths = Object.keys(data.paths)
      .filter(path => initialFilters.some(filter => path === filter))
      .reduce((obj, key) => {
        obj[key] = data.paths[key];
        return obj;
      }, {});

    setFilteredSpec({
      ...data,
      paths: filteredPaths,
    });
  };


  return (
    <Container id='Container'>
      <Center id='Center'>

        <div className="flex-box container-box">
          <div className="content-box">
            <img src="https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/siteSubscribeLogoGojur.png" alt="logo" />
          </div>
        </div>

        <div>
          {filteredSpec ? (
            <SwaggerUI spec={filteredSpec} />
          ) : (
            <p>Carregando...</p>
          )}
          <br /><br />
        </div>

      </Center>
    </Container>
  );
};

export default APIDocumentation;
