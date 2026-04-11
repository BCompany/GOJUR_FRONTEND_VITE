/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { ChangeEvent, useRef, useState } from 'react';
import { FiSave, FiImage, FiTrash2 } from 'react-icons/fi';
import { MdBlock } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { useToast } from 'context/toast';
import {
  Container,
  TaskBar,
  TwoColumns,
  EditorPanel,
  PreviewPanel,
  SectionCard,
  SectionBody,
  FieldRow,
  FieldGroup,
  ColorRow,
  LogoUploadArea,
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
} from './styles';

const InvoiceModel: React.FC = () => {
  const history = useHistory();
  const { addToast } = useToast();
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Section 1 — company
  const [logoSrc, setLogoSrc] = useState<string>('');
  const [headerColor, setHeaderColor] = useState<string>('#0077c0');
  const [companyNome, setCompanyNome] = useState<string>('');
  const [companyEndereco, setCompanyEndereco] = useState<string>('');
  const [companyEmail, setCompanyEmail] = useState<string>('');
  const [companyTelefone, setCompanyTelefone] = useState<string>('');

  // Section 2 — fatura / vencimento + cliente
  const [faturaNumero, setFaturaNumero] = useState<string>('');
  const [vencimento, setVencimento] = useState<string>('');
  const [clienteNome, setClienteNome] = useState<string>('João da Silva');
  const [clienteEndereco, setClienteEndereco] = useState<string>('Praça da Sé, s/n – Centro, São Paulo');
  const [clienteEmail, setClienteEmail] = useState<string>('joaosilva@xxxx.com.br');

  // Section 3 — descrição
  const [descricao, setDescricao] = useState<string>('');

  const handleLogoSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setLogoSrc(reader.result as string);
    reader.readAsDataURL(file);

    // reset so the same file can be re-selected
    e.target.value = '';
  };

  const handleRemoveLogo = () => {
    setLogoSrc('');
  };

  const handleSave = () => {
    addToast({
      type: 'success',
      title: 'Modelo de Fatura Salvo',
      description: 'As configurações do modelo de fatura foram salvas.',
    });
  };

  const displayFatura = faturaNumero || '0001';
  const displayVencimento = vencimento
    ? new Date(vencimento + 'T00:00:00').toLocaleDateString('pt-BR')
    : '30/04/2026';

  return (
    <Container>
      <TaskBar>
        <button className="buttonClick" type="button" onClick={handleSave}>
          <FiSave />
          Salvar
        </button>
        <button className="buttonClick" type="button" onClick={() => history.goBack()}>
          <MdBlock />
          Fechar
        </button>
      </TaskBar>

      <TwoColumns>
        {/* ─── LEFT: Editor ─── */}
        <EditorPanel>

          {/* Section 1 — Dados da Empresa */}
          <SectionCard>
            <header>Dados da Empresa</header>
            <SectionBody>

              <LogoUploadArea>
                {logoSrc && <img src={logoSrc} alt="Logotipo" />}

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
                    onClick={handleRemoveLogo}
                    style={{ background: 'linear-gradient(135deg, #e57373, #c62828)' }}
                  >
                    <FiTrash2 />
                    Remover Logotipo
                  </button>
                )}
              </LogoUploadArea>

              <ColorRow>
                <label htmlFor="headerColor">Cor do cabeçalho:</label>
                <input
                  id="headerColor"
                  type="color"
                  value={headerColor}
                  onChange={(e) => setHeaderColor(e.target.value)}
                  title="Selecione a cor do cabeçalho da fatura"
                />
                <span>{headerColor.toUpperCase()}</span>
              </ColorRow>

              <FieldGroup>
                <label htmlFor="companyNome">Nome</label>
                <input
                  id="companyNome"
                  type="text"
                  value={companyNome}
                  maxLength={100}
                  autoComplete="off"
                  onChange={(e) => setCompanyNome(e.target.value)}
                />
              </FieldGroup>

              <FieldGroup>
                <label htmlFor="companyEndereco">Endereço</label>
                <input
                  id="companyEndereco"
                  type="text"
                  value={companyEndereco}
                  maxLength={150}
                  autoComplete="off"
                  onChange={(e) => setCompanyEndereco(e.target.value)}
                />
              </FieldGroup>

              <FieldRow>
                <FieldGroup>
                  <label htmlFor="companyEmail">E-mail</label>
                  <input
                    id="companyEmail"
                    type="email"
                    value={companyEmail}
                    maxLength={100}
                    autoComplete="off"
                    onChange={(e) => setCompanyEmail(e.target.value)}
                  />
                </FieldGroup>
                <FieldGroup>
                  <label htmlFor="companyTelefone">Telefone</label>
                  <input
                    id="companyTelefone"
                    type="text"
                    value={companyTelefone}
                    maxLength={20}
                    autoComplete="off"
                    onChange={(e) => setCompanyTelefone(e.target.value)}
                  />
                </FieldGroup>
              </FieldRow>

            </SectionBody>
          </SectionCard>

          {/* Section 2 — Dados da Fatura + Cliente */}
          <SectionCard>
            <header>Número / Vencimento e Dados do Cliente</header>
            <SectionBody>

              <FieldRow>
                <FieldGroup>
                  <label htmlFor="faturaNumero">Fatura nº</label>
                  <input
                    id="faturaNumero"
                    type="number"
                    value={faturaNumero}
                    min={1}
                    autoComplete="off"
                    onChange={(e) => setFaturaNumero(e.target.value)}
                  />
                </FieldGroup>
                <FieldGroup>
                  <label htmlFor="vencimento">Vencimento</label>
                  <input
                    id="vencimento"
                    type="date"
                    value={vencimento}
                    onChange={(e) => setVencimento(e.target.value)}
                  />
                </FieldGroup>
              </FieldRow>

              <FieldGroup>
                <label htmlFor="clienteNome">Nome do Cliente</label>
                <input
                  id="clienteNome"
                  type="text"
                  value={clienteNome}
                  maxLength={100}
                  autoComplete="off"
                  onChange={(e) => setClienteNome(e.target.value)}
                />
              </FieldGroup>

              <FieldGroup>
                <label htmlFor="clienteEndereco">Endereço do Cliente</label>
                <input
                  id="clienteEndereco"
                  type="text"
                  value={clienteEndereco}
                  maxLength={150}
                  autoComplete="off"
                  onChange={(e) => setClienteEndereco(e.target.value)}
                />
              </FieldGroup>

              <FieldGroup>
                <label htmlFor="clienteEmail">E-mail do Cliente</label>
                <input
                  id="clienteEmail"
                  type="email"
                  value={clienteEmail}
                  maxLength={100}
                  autoComplete="off"
                  onChange={(e) => setClienteEmail(e.target.value)}
                />
              </FieldGroup>

            </SectionBody>
          </SectionCard>

          {/* Section 3 — Descrição */}
          <SectionCard>
            <header>Descrição dos Serviços</header>
            <SectionBody>

              <FieldGroup>
                <label htmlFor="descricao">Descrição</label>
                <textarea
                  id="descricao"
                  value={descricao}
                  placeholder="Descreva os serviços prestados..."
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </FieldGroup>

            </SectionBody>
          </SectionCard>

        </EditorPanel>

        {/* ─── RIGHT: Live Preview ─── */}
        <PreviewPanel>
          <InvoicePaper>

            <InvoiceHeader bgColor={headerColor}>
              <InvoiceHeaderLeft>
                {logoSrc && <img src={logoSrc} alt="Logotipo" />}
                <InvoiceCompanyInfo>
                  <strong>{companyNome || 'Nome da Empresa'}</strong>
                  {companyEndereco && <span>{companyEndereco}</span>}
                  {companyEmail && <span>{companyEmail}</span>}
                  {companyTelefone && <span>{companyTelefone}</span>}
                </InvoiceCompanyInfo>
              </InvoiceHeaderLeft>

              <InvoiceBadge>
                <h2>Fatura</h2>
                <span>Nº {displayFatura}</span>
              </InvoiceBadge>
            </InvoiceHeader>

            <InvoiceBody>

              <InvoiceMetaRow>
                <InvoiceMetaItem>
                  <span>Número da Fatura</span>
                  <strong>#{displayFatura}</strong>
                </InvoiceMetaItem>
                <InvoiceMetaItem>
                  <span>Data de Emissão</span>
                  <strong>{new Date().toLocaleDateString('pt-BR')}</strong>
                </InvoiceMetaItem>
                <InvoiceMetaItem>
                  <span>Vencimento</span>
                  <strong>{displayVencimento}</strong>
                </InvoiceMetaItem>
              </InvoiceMetaRow>

              <InvoiceCustomerSection>
                <p className="section-title">Dados do Cliente</p>
                <p className="field">
                  <span>Nome: </span>
                  {clienteNome || '—'}
                </p>
                <p className="field">
                  <span>Endereço: </span>
                  {clienteEndereco || '—'}
                </p>
                <p className="field">
                  <span>E-mail: </span>
                  {clienteEmail || '—'}
                </p>
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
                      <td>{descricao || 'Serviços jurídicos prestados conforme contrato'}</td>
                      <td>1</td>
                      <td>R$ 0,00</td>
                    </tr>
                  </tbody>
                </table>
              </InvoiceDescSection>

            </InvoiceBody>

            <InvoiceFooter>
              {companyNome || 'Nome da Empresa'} &nbsp;·&nbsp;
              {companyEmail || 'contato@empresa.com.br'} &nbsp;·&nbsp;
              {companyTelefone || '(00) 0000-0000'}
            </InvoiceFooter>

          </InvoicePaper>
        </PreviewPanel>
      </TwoColumns>
    </Container>
  );
};

export default InvoiceModel;
