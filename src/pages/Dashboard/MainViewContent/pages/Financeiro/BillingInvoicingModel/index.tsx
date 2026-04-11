/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { ChangeEvent, useRef, useState } from 'react';
import { FiSave, FiImage, FiTrash2 } from 'react-icons/fi';
import { MdBlock } from 'react-icons/md';
import { IoColorPaletteOutline } from 'react-icons/io5';
import { useHistory } from 'react-router-dom';
import { useToast } from 'context/toast';
import { HeaderPage } from 'components/HeaderPage';
import {
  Container,
  ActionBar,
  InvoiceWrapper,
  BottomBar,
  InvoicePaper,
  InvoiceHeader,
  InvoiceHeaderLeft,
  InvoiceCompanyInfo,
  InvoiceBadge,
  InvoiceBody,
  InvoiceMetaRow,
  InvoiceMetaItem,
  InvoiceCustomerSection,
  InvoiceDescSection,
  InvoiceFooter,
  ColorButtonWrap,
} from './styles';

const BillingInvoicingModel: React.FC = () => {
  const history = useHistory();
  const { addToast } = useToast();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const [logoSrc, setLogoSrc] = useState<string>('');
  const [headerColor, setHeaderColor] = useState<string>('#0077c0');

  const companyNome = 'Escritório Jurídico Exemplo';
  const companyEndereco = 'Av. Paulista, 1000 – Bela Vista, São Paulo – SP';
  const companyEmail = 'contato@escritorio.com.br';
  const companyTelefone = '(11) 3000-0000';
  const faturaNumero = '0001';
  const vencimento = '30/04/2026';
  const clienteNome = 'João da Silva';
  const clienteEndereco = 'Praça da Sé, s/n – Centro, São Paulo – SP';
  const clienteEmail = 'joaosilva@xxxx.com.br';
  const descricao = 'Serviços jurídicos prestados conforme contrato';

  const handleLogoSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoSrc(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSave = () => {
    addToast({
      type: 'success',
      title: 'Modelo de Fatura Salvo',
      description: 'As configurações do modelo de fatura foram salvas.',
    });
  };

  return (
    <Container>
      <HeaderPage />

      {/* ─── Action buttons (top) ─── */}
      <ActionBar>
        <input
          ref={logoInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleLogoSelect}
        />

        {!logoSrc ? (
          <button
            className="buttonClick"
            type="button"
            title="Clique para inserir o logotipo"
            onClick={() => logoInputRef.current?.click()}
          >
            <FiImage />
            Inserir Logotipo
          </button>
        ) : (
          <button
            className="buttonClick"
            type="button"
            title="Clique para remover o logotipo"
            onClick={() => setLogoSrc('')}
            style={{ background: 'linear-gradient(135deg, #e57373, #c62828)' }}
          >
            <FiTrash2 />
            Remover Logotipo
          </button>
        )}

        <ColorButtonWrap>
          <input
            ref={colorInputRef}
            type="color"
            value={headerColor}
            onChange={(e) => setHeaderColor(e.target.value)}
            title="Selecione a cor"
          />
          <button
            className="buttonClick"
            type="button"
            title="Selecionar cor do cabeçalho"
            onClick={() => colorInputRef.current?.click()}
          >
            <IoColorPaletteOutline />
            Selecionar Cor
            <span className="color-swatch" style={{ backgroundColor: headerColor }} />
          </button>
        </ColorButtonWrap>
      </ActionBar>

      {/* ─── Invoice (centered) ─── */}
      <InvoiceWrapper>
        <InvoicePaper>

          <InvoiceHeader bgColor={headerColor}>
            <InvoiceHeaderLeft>
              {logoSrc && <img src={logoSrc} alt="Logotipo" />}
              <InvoiceCompanyInfo>
                <strong>{companyNome}</strong>
                <span>{companyEndereco}</span>
                <span>{companyEmail} &nbsp;|&nbsp; {companyTelefone}</span>
              </InvoiceCompanyInfo>
            </InvoiceHeaderLeft>

            <InvoiceBadge>
              <h2>Fatura</h2>
              <span>Nº {faturaNumero}</span>
            </InvoiceBadge>
          </InvoiceHeader>

          <InvoiceBody>

            <InvoiceMetaRow>
              <InvoiceMetaItem>
                <span>Número da Fatura</span>
                <strong>#{faturaNumero}</strong>
              </InvoiceMetaItem>
              <InvoiceMetaItem>
                <span>Data de Emissão</span>
                <strong>{new Date().toLocaleDateString('pt-BR')}</strong>
              </InvoiceMetaItem>
              <InvoiceMetaItem>
                <span>Vencimento</span>
                <strong>{vencimento}</strong>
              </InvoiceMetaItem>
            </InvoiceMetaRow>

            <InvoiceCustomerSection>
              <p className="section-title">Dados do Cliente</p>
              <p className="field"><span>Nome: </span>{clienteNome}</p>
              <p className="field"><span>Endereço: </span>{clienteEndereco}</p>
              <p className="field"><span>E-mail: </span>{clienteEmail}</p>
            </InvoiceCustomerSection>

            <InvoiceDescSection>
              <p className="section-title">Descrição dos Serviços</p>
              <table className="desc-table">
                <thead>
                  <tr>
                    <th style={{ width: '60%' }}>Descrição</th>
                    <th>Quantidade</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{descricao}</td>
                    <td>1</td>
                    <td>R$ 0,00</td>
                  </tr>
                </tbody>
              </table>
            </InvoiceDescSection>

          </InvoiceBody>

          <InvoiceFooter>
            {companyNome} &nbsp;·&nbsp; {companyEmail} &nbsp;·&nbsp; {companyTelefone}
          </InvoiceFooter>

        </InvoicePaper>
      </InvoiceWrapper>

      {/* ─── Save / Close (bottom) ─── */}
      <BottomBar>
        <button className="buttonClick" type="button" onClick={handleSave}>
          <FiSave />
          Salvar
        </button>
        <button className="buttonClick" type="button" onClick={() => history.goBack()}>
          <MdBlock />
          Fechar
        </button>
      </BottomBar>

    </Container>
  );
};

export default BillingInvoicingModel;
