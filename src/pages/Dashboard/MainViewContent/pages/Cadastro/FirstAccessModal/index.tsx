/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-one-expression-per-line */

import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import api from 'services/api';
import { useDevice } from "react-use-device";
import { FiTrash } from 'react-icons/fi';
import { FaCheck } from 'react-icons/fa';
import { GoAlert, GoCheck } from 'react-icons/go';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { Container, Content, Center, Modal, ModalAlert, CenterMobile } from './styles';

export interface ILawyer {
  lawyerId: number;
  lawyerType: string;
  lawyerState: string;
  lawyerOAB: string;
  lawyerName: string;
  status: string;
  action: string;
  statusAfterValidation: string;
}

export interface IOAB {
  num_OAB: string;
  UF: string;
  nome_Advogado: string;
  tipo_Inscricao: string;
  status_Validacao: string;
}

const FirstAccessModal = (props) => {
  const { isMOBILE } = useDevice()
  const {CloseFirstAccess} = props.callbackFunction
  const [lawyerList, setLawyerList] = useState<ILawyer[]>([]);
  const [lawyerId, setLawyerId] = useState(1);
  const [checkCivel, setCheckCivel] = useState<boolean>(false);
  const [checkTrabalhista, setCheckTrabalhista] = useState<boolean>(false);
  const [checkCriminal, setCheckCriminal] = useState<boolean>(false);
  const [checkPrevidenciario, setCheckPrevidenciario] = useState<boolean>(false);
  const [checkTributaria, setCheckTributaria] = useState<boolean>(false);
  const [checkOutros, setCheckOutros] = useState<boolean>(false);
  const [companyType, setCompanyType] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const token = localStorage.getItem('@GoJur:token');
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorCompanyType, setErrorCompanyType] = useState<string>('');
  const [errorQuantity, setErrorQuantity] = useState<string>('');
  const [errorName, setErrorName] = useState<string>('');
  const [errorQtt, setErrorQtt] = useState<string>('');
  const [button0, setButton0] = useState<boolean>(false);
  const [button1, setButton1] = useState<boolean>(false);
  const [button2, setButton2] = useState<boolean>(false);
  const [button3, setButton3] = useState<boolean>(false);
  const [button4, setButton4] = useState<boolean>(false);
  const [button5, setButton5] = useState<boolean>(false);
  const [button6, setButton6] = useState<boolean>(false);
  const [button7, setButton7] = useState<boolean>(false);
  const [button8, setButton8] = useState<boolean>(false);
  const [button9, setButton9] = useState<boolean>(false);


  useEffect(() => {
    if(lawyerId == 1)
    {
      NewLawyer(lawyerId)
    }
  },[lawyerId]);


  const NewLawyer = async (id) => {
    const newLawyer: ILawyer = {
      lawyerId:id,
      lawyerType: 'A',
      lawyerState: 'SP',
      lawyerOAB:'',
      lawyerName: '',
      status: '',
      action: '',
      statusAfterValidation:''
    }
    setLawyerList(oldLawyer => [...oldLawyer, newLawyer])
    setLawyerId(id + 1)
  };


  const ChangeType = (value, lawyerId) => {
    const newLawyer = lawyerList.map(lawyer => lawyer.lawyerId === lawyerId ? {
      ...lawyer,
      lawyerType:value
    }: lawyer)
    setLawyerList(newLawyer)
  };


  const ChangeState = (value, lawyerId) => {
    const newLawyer = lawyerList.map(lawyer => lawyer.lawyerId === lawyerId ? {
      ...lawyer,
      lawyerState:value
    }: lawyer)
    setLawyerList(newLawyer)
  };


  const ChangeOAB = useCallback((value, lawyerId) => {
    const newLawyer = lawyerList.map(lawyer => lawyer.lawyerId === lawyerId ? {
      ...lawyer,
      lawyerOAB:value
    }: lawyer)
    setLawyerList(newLawyer)
  }, [lawyerList]);


  const ChangeName = useCallback((lawyerId, value, lawyerStatus, statusValidation) => {
    const newLawyer = lawyerList.map(lawyer => lawyer.lawyerId == lawyerId ? {
      ...lawyer,
      lawyerName:value,
      status: lawyerStatus,
      statusAfterValidation:statusValidation
    }: lawyer)
    setLawyerList(newLawyer)
  }, [lawyerList]);


  const CheckOAB = useCallback((lawyerId, value) => {
    const newLawyer = lawyerList.map(lawyer => lawyer.lawyerId === lawyerId ? {
      ...lawyer,
      statusAfterValidation:value
    }: lawyer)
    setLawyerList(newLawyer)
  }, [lawyerList]);


  const RemovePayment = useCallback((lawyerId) => {
    const lawyer = lawyerList.map(i => i.lawyerId === lawyerId ? {
      ...i,
      action: 'DELETE'
    }: i);
    setLawyerList(lawyer)
  },[lawyerList]);


  const handleInputBlur = useCallback((lawyerId) => {
    const newLawyer = lawyerList.find(lawyer => lawyer.lawyerId == lawyerId);
    ValidateOAB(lawyerId, newLawyer?.lawyerOAB, newLawyer?.lawyerState, newLawyer?.lawyerType);
  },[lawyerList]);


  const ValidateOAB = async (id, oab, uf, type) => {
    try{
      CheckOAB(id, 'Validando OAB...')

      let ufParameter = uf;
      let typeParameter = type;
      
      if(uf == '')
        ufParameter = 'SP'
      if(type == '')
        typeParameter = 'A'

      const response = await api.post('/FirstAccess/ValidarOAB', {
        OAB: oab,
        UF: ufParameter,
        TipoInscricao:typeParameter,
        token
      })

      if(response.data.nome_Advogado != null)
      {
        ChangeName(id, response.data.nome_Advogado, response.data.status_Validacao, 'OAB Validada')
      }
      else{
        ChangeName(id, response.data.nome_Advogado, response.data.status_Validacao, 'OAB Não Encontrada')
      }
    }
    catch(err){
      alert(err)
    }
  };


  const Save = useCallback(async() => {
    try{

      let error = '';
      let count = 0;
      let tpo_Interesse = '';

      lawyerList.map(item => {
        if(item.action != 'DELETE' && item.lawyerOAB != '')
        {
          if(item.lawyerName == null || item.lawyerName == "")
          {
            error += 'Erro';
            setErrorName('- Como você informou o número da OAB e não conseguimos validar, por favor preencher o campo Nome do Advogado.')
            setHasError(true);
          }
        }
      })

      if(companyType == '')
      {
        error += 'Erro';
        setErrorCompanyType('- Preencher o campo de atuação do escritório.');
        setHasError(true);
      }
        
      if(quantity == '')
      {
        error += 'Erro';
        setErrorQuantity('- Preencher o campo de quantidade de pessoas.');
        setHasError(true);
      }

      if(button0){
        count++;
        tpo_Interesse += 'Controle Prazos Judiciais, ';
      }
      if(button1){
        count++;
        tpo_Interesse += 'Gestão de Processos, ';
      }
      if(button2){
        count++;
        tpo_Interesse += 'Monitorar Processos Tribunal, ';
      }
      if(button3){
        count++;
        tpo_Interesse += 'Receber Publicações, ';
      }
      if(button4){
        count++;
        tpo_Interesse += 'Automatizar Documentos, ';
      }
      if(button5){
        count++;
        tpo_Interesse += 'Gestão Equipe e Tarefas, ';
      }
      if(button6){
        count++;
        tpo_Interesse += 'Financeiro e Faturamento, ';
      }
      if(button7){
        count++;
        tpo_Interesse += 'Relacionamento com Cliente, ';
      }
      if(button8){
        count++;
        tpo_Interesse += 'Contratos e Assessoria, ';
      }
      if(button9){
        count++;
        tpo_Interesse += 'Melhorar Faturamento, ';
      }

      if(count == 0)
      {
        error += 'Erro';
        setErrorQtt('- Selecionar pelo menos 1 opção de utilização do GOJUR.');
        setHasError(true);
      }

      if(count > 3)
      {
        error += 'Erro';
        setErrorQtt('- Selecionar no máximo 3 opções de utilização do GOJUR.');
        setHasError(true);
      }

      if(error != '')
      {
        return;
      }
      
      const listOAB: IOAB[] = []

      lawyerList.map(item => {
        if(item.action != 'DELETE')
        {
          return listOAB.push({
            num_OAB: item.lawyerOAB,
            UF: item.lawyerState,
            nome_Advogado: item.lawyerName,
            tipo_Inscricao: item.lawyerType,
            status_Validacao: item.status
          })
        }
      })

      api.post('/FirstAccess/Salvar', {
        tpo_TipoAtuacao: companyType,
        qtd_Pessoas: quantity,
        tpo_AtuacaoEquipe: null,
        tpo_Interesse,
        listOABs:listOAB,
        token
      })

      CloseFirstAccess()
    }
    catch(err:any){
      alert(err.response.data.Message)
    }
  },[lawyerList, companyType, quantity, checkCivel, checkTrabalhista, checkCriminal, checkPrevidenciario, checkTributaria, checkOutros, errorCompanyType, errorQuantity, errorQtt, errorName, button0, button1, button2, button3, button4, button5, button6, button7, button8, button9]);


  const CloseModal = () => {
    setHasError(false);
    setErrorCompanyType('');
    setErrorQuantity('');
    setErrorQtt('');
    setErrorName('');
  };


  const ButtonClick = useCallback((id, statusButton) => {
    let count = 0;

    if(button0) count++;
    if(button1) count++;
    if(button2) count++;
    if(button3) count++;
    if(button4) count++;
    if(button5) count++;
    if(button6) count++;
    if(button7) count++;
    if(button8) count++;
    if(button9) count++;

    if(count < 3){
      handleSetButton(id, statusButton)
    }
    else if(count == 3 && !statusButton){
      handleSetButton(id, statusButton)
    }
    else{
        setErrorQtt('- Selecionar no máximo 3 opções de utilização do GOJUR.');
        setHasError(true);
    }
  },[button0, button1, button2, button3, button4, button5, button6, button7, button8, button9]);


  const handleSetButton = (id, statusButton) => {
    
    if(id == 0) setButton0(statusButton)
    if(id == 1) setButton1(statusButton)
    if(id == 2) setButton2(statusButton)
    if(id == 3) setButton3(statusButton)
    if(id == 4) setButton4(statusButton)
    if(id == 5) setButton5(statusButton)
    if(id == 6) setButton6(statusButton)
    if(id == 7) setButton7(statusButton)
    if(id == 8) setButton8(statusButton)
    if(id == 9) setButton9(statusButton)
  };


  return (
    <>
      <Modal id="modalFinance" show>
        {!isMOBILE && (
          <Container>
            <Content>
              <Center>

                <div style={{float:'left', width:'25%', marginTop:'-10px'}}>
                  <img alt='' src='https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/siteSubscribeLogoGojur.png' />
                </div>
                <div style={{float:'left', width:'75%', fontSize:'16px', marginTop:'10px', textAlign:'end'}}>
                  Seja bem vindo ao GOJUR! <br />
                  Precisamos de mais algumas informações para configurar o serviço para você
                </div>

                <br /><br /><br />
                <div className='items'>
                  Para que possamos automaticamente pesquisar suas publicações, nos informe as OABs dos advogados de sua equipe
                </div>
                
                <div className='items'>
                  <div id='listOAB'>
                    {lawyerList.map(lawyer => (
                      <>
                        {lawyer.action != 'DELETE' && (
                          <div className='items'>

                            <button style={{color:'blue', marginTop:'10px'}} type="button" onClick={() => RemovePayment(lawyer.lawyerId)}>
                              <FiTrash />
                            </button>
                            &nbsp;&nbsp;

                            {lawyer.statusAfterValidation == "OAB Validada" && (
                              <button style={{color:'#19a50d', marginTop:'10px'}} type="button" title='Informe o nº da OAB em conjunto com o estado de atuação e o tipo de inscrição'>
                                <GoCheck />&nbsp;&nbsp;&nbsp;&nbsp;
                              </button>
                            )}

                            {lawyer.statusAfterValidation != "OAB Validada" && (
                              <button style={{color:'#E3E300', marginTop:'10px'}} type="button" title='Informe o nº da OAB em conjunto com o estado de atuação e o tipo de inscrição'>
                                <GoAlert />&nbsp;&nbsp;&nbsp;&nbsp;
                              </button>
                            )}

                            <select
                              className='itemsSelect'
                              onChange={(e: ChangeEvent<HTMLSelectElement>) => ChangeType(e.target.value, lawyer.lawyerId)}
                              disabled={lawyer.statusAfterValidation == "OAB Validada"}
                            >
                              <option value="A">Advogado</option>
                              <option value="S">Suplementar</option>
                              <option value="E">Estagiário</option>
                            </select>
                            &nbsp;&nbsp;&nbsp;&nbsp;

                            <select
                              className='itemsSelect'
                              onChange={(e: ChangeEvent<HTMLSelectElement>) => ChangeState(e.target.value, lawyer.lawyerId)}
                              disabled={lawyer.statusAfterValidation == "OAB Validada"}
                            >
                              <option value='SP'>SP</option>
                              <option value='RJ'>RJ</option>
                              <option value='MG'>MG</option>
                              <option value='AC'>AC</option>
                              <option value='AL'>AL</option>
                              <option value='AP'>AP</option>
                              <option value='AM'>AM</option>
                              <option value='BA'>BA</option>
                              <option value='CE'>CE</option>
                              <option value='DF'>DF</option>
                              <option value='ES'>ES</option>
                              <option value='GO'>GO</option>
                              <option value='MA'>MA</option>
                              <option value='MT'>MT</option>
                              <option value='MS'>MS</option>
                              <option value='PA'>PA</option>
                              <option value='PB'>PB</option>
                              <option value='PR'>PR</option>
                              <option value='PE'>PE</option>
                              <option value='PI'>PI</option>
                              <option value='RN'>RN</option>
                              <option value='RS'>RS</option>
                              <option value='RO'>RO</option>
                              <option value='RR'>RR</option>
                              <option value='SC'>SC</option>
                              <option value='SE'>SE</option>
                              <option value='TO'>TO</option>                
                            </select>
                            &nbsp;&nbsp;&nbsp;&nbsp;

                            <input
                              disabled={lawyer.statusAfterValidation == "OAB Validada"}
                              type='text'
                              id='numeroOAB'
                              placeholder='Nº OAB (sem UF)'
                              onChange={(e: ChangeEvent<HTMLInputElement>) => ChangeOAB(e.target.value, lawyer.lawyerId)}
                              onBlur={() => handleInputBlur(lawyer.lawyerId)}
                            />
                            &nbsp;&nbsp;&nbsp;&nbsp;

                            <input
                              disabled={lawyer.statusAfterValidation == "OAB Validada"}
                              type='text'
                              id='nome'
                              placeholder='Nome do Advogado'
                              value={lawyer.lawyerName}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => ChangeName(lawyer.lawyerId, e.target.value, 'I', 'OAB Não Encontrada')}
                            />
                            &nbsp;&nbsp;&nbsp;&nbsp;

                            {lawyer.statusAfterValidation == "OAB Validada" && (
                              <div style={{fontSize:'12px', width:'130px'}}>
                                <label style={{color:'#19a50d'}}>
                                  {lawyer.statusAfterValidation}
                                </label>
                              </div>
                            )}

                            {lawyer.statusAfterValidation != "OAB Validada" && (
                              <div style={{fontSize:'12px', width:'130px'}}>
                                <label style={{color:'#830404'}}>
                                  {lawyer.statusAfterValidation}
                                </label>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ))}

                    <div className='items'>
                      <p style={{cursor:'pointer', color:'blue', marginTop:'5px'}} onClick={() => NewLawyer(lawyerId)}>
                        <span> + Adicionar nova OAB</span>
                      </p>
                    </div>

                  </div>
                </div>
                <br />

                <div className='items'>Você atua em um escritório de advocacia ou departamento jurídico ?</div>
                <div className='itemsInput'>
                  <select onChange={(e: ChangeEvent<HTMLSelectElement>) => setCompanyType(e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="EA">Escritório de Advocacia</option>
                    <option value="DJ">Departamento Juridico</option>
                  </select>
                </div>
                <br />

                <div className='items'>Quantas pessoas estão na sua equipe jurídica ?</div>
                <div className='itemsInput'>
                  <select onChange={(e: ChangeEvent<HTMLSelectElement>) => setQuantity(e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="<=2">Até 2 Pessoas</option>
                    <option value="3-5">Entre 3 e 5 Pessoas</option>
                    <option value="6-10">Entre 6 e 10 Pessoas</option>
                    <option value=">10">Mais de 10 Pessoas</option>
                  </select>
                </div>
                <br />

                <div style={{fontWeight:600}} className='items'>Qual o principal objetivo que deseja atingir utilizando o GOJUR ? Escolha até 3 opções.</div>
                <div className='items' style={{fontSize:'12px'}}>Com estas informações nós iremos lhe ajudar no caminho de forma mais rápida.</div>
                <div style={{height:'20px'}}><>&nbsp;</></div>
                <div className='items'>
                  <button type="button" className='itemsButton' style={{background: button0 ? 'var(--blue-twitter)' : '#FFFFFF', color: button0 ? '#FFFFFF' : '#000000'}} onClick={()=> ButtonClick(0, !button0)}>Controle Prazos Judiciais</button>&nbsp;&nbsp;
                  <button type="button" className='itemsButton' style={{background: button1 ? 'var(--blue-twitter)' : '#FFFFFF', color: button1 ? '#FFFFFF' : '#000000'}} onClick={()=> ButtonClick(1, !button1)}>Gestão de Processos</button>&nbsp;&nbsp;
                  <button type="button" className='itemsButton' style={{background: button2 ? 'var(--blue-twitter)' : '#FFFFFF', color: button2 ? '#FFFFFF' : '#000000'}} onClick={()=> ButtonClick(2, !button2)}>Monitorar Processos Tribunal</button>&nbsp;&nbsp;
                  <button type="button" className='itemsButton' style={{background: button3 ? 'var(--blue-twitter)' : '#FFFFFF', color: button3 ? '#FFFFFF' : '#000000'}} onClick={()=> ButtonClick(3, !button3)}>Receber Publicações</button>&nbsp;&nbsp;
                  <button type="button" className='itemsButton' style={{background: button4 ? 'var(--blue-twitter)' : '#FFFFFF', color: button4 ? '#FFFFFF' : '#000000'}} onClick={()=> ButtonClick(4, !button4)}>Automatizar Documentos</button>&nbsp;&nbsp;
                </div>
                <div style={{height:'10px'}}><>&nbsp;</></div>
                <div className='items'>
                  <button type="button" className='itemsButton' style={{background: button5 ? 'var(--blue-twitter)' : '#FFFFFF', color: button5 ? '#FFFFFF' : '#000000'}} onClick={()=> ButtonClick(5, !button5)}>Gestão Equipe e Tarefas</button>&nbsp;&nbsp;
                  <button type="button" className='itemsButton' style={{background: button6 ? 'var(--blue-twitter)' : '#FFFFFF', color: button6 ? '#FFFFFF' : '#000000'}} onClick={()=> ButtonClick(6, !button6)}>Financeiro e Faturamento</button>&nbsp;&nbsp;
                  <button type="button" className='itemsButton' style={{background: button7 ? 'var(--blue-twitter)' : '#FFFFFF', color: button7 ? '#FFFFFF' : '#000000'}} onClick={()=> ButtonClick(7, !button7)}>Relacionamento com Cliente</button>&nbsp;&nbsp;
                  <button type="button" className='itemsButton' style={{background: button8 ? 'var(--blue-twitter)' : '#FFFFFF', color: button8 ? '#FFFFFF' : '#000000'}} onClick={()=> ButtonClick(8, !button8)}>Contratos e Assessoria</button>&nbsp;&nbsp;
                  <button type="button" className='itemsButton' style={{background: button9 ? 'var(--blue-twitter)' : '#FFFFFF', color: button9 ? '#FFFFFF' : '#000000'}} onClick={()=> ButtonClick(9, !button9)}>Melhorar Faturamento</button>&nbsp;&nbsp;
                </div>

                <div style={{height:'20px'}}><>&nbsp;</></div>
                <div className='items'>
                  <p style={{cursor:'pointer', color:'blue'}} onClick={() => Save()}>
                    <span style={{fontWeight:600}}>Clique para Acessar o GOJUR</span>
                  </p>
                </div>
                <br />
              </Center>
            </Content>

            {hasError && <Overlay />}
            {hasError && (
              <ModalAlert>
                <div id='Header' style={{height:'30px', fontWeight:600}}>
                  <div className='menuTitle'>
                    &nbsp;&nbsp;&nbsp;&nbsp;ATENÇÃO
                  </div>
                  <div className='menuSection'>
                    &nbsp;
                  </div>
                </div>
                <br />

                <div style={{marginLeft:'20px'}}>
                  {errorCompanyType}{errorCompanyType != '' ? <br /> : ''}
                  {errorQuantity}{errorQuantity != '' ? <br /> : ''}
                  {errorQtt}{errorQtt != '' ? <br /> : ''}
                  {errorName}{errorName != '' ? <br /> : ''}
                  <br /><br />
                </div>
                <div style={{float:'left', marginLeft:'240px'}}>
                  <button 
                    className="buttonClick"
                    type='button'
                    onClick={()=> CloseModal()}
                    style={{width:'100px'}}
                  >
                    <FaCheck />
                    Ok
                  </button>
                </div>
                <br /><br />
              </ModalAlert>
            )}
          </Container>
        )}

        {isMOBILE && (
          <Container>
            <Content>
              <CenterMobile>
                <div style={{float:'left', width:'25%', marginTop:'-10px'}}>
                  <img alt='' src='https://bcompany-publicbkt.s3.us-west-1.amazonaws.com/GOJUR/images/siteSubscribeLogoGojur.png' />
                </div>
                <br /><br /><br /><br />
                <div style={{float:'left', width:'100%', fontSize:'9px', marginTop:'10px'}}>
                  Seja bem vindo ao GOJUR! <br />
                  Precisamos de mais algumas informações para configurar o serviço para você. <br /><br />
                  Para que possamos automaticamente pesquisar suas publicações, nos informe as OABs dos advogados de sua equipe
                </div>
                
                <div className='items'>
                  <div id='listOAB'>
                    {lawyerList.map(lawyer => (
                      <>
                        {lawyer.action != 'DELETE' && (
                          <div className='items'>

                            <button style={{color:'blue', marginTop:'10px'}} type="button" onClick={() => RemovePayment(lawyer.lawyerId)}>
                              <FiTrash />
                            </button>
                            &nbsp;&nbsp;

                            {lawyer.statusAfterValidation == "OAB Validada" && (
                              <button style={{color:'#19a50d', marginTop:'10px'}} type="button" title='Informe o nº da OAB em conjunto com o estado de atuação e o tipo de inscrição'>
                                <GoCheck />&nbsp;&nbsp;&nbsp;&nbsp;
                              </button>
                            )}

                            {lawyer.statusAfterValidation != "OAB Validada" && (
                              <button style={{color:'#E3E300', marginTop:'10px'}} type="button" title='Informe o nº da OAB em conjunto com o estado de atuação e o tipo de inscrição'>
                                <GoAlert />&nbsp;&nbsp;&nbsp;&nbsp;
                              </button>
                            )}

                            <select
                              className='itemsSelect'
                              onChange={(e: ChangeEvent<HTMLSelectElement>) => ChangeType(e.target.value, lawyer.lawyerId)}
                              disabled={lawyer.statusAfterValidation == "OAB Validada"}
                              style={{float:'right'}}
                            >
                              <option value="A">Advogado</option>
                              <option value="S">Suplementar</option>
                              <option value="E">Estagiário</option>
                            </select>
                            <br />

                            <select
                              className='itemsSelect'
                              onChange={(e: ChangeEvent<HTMLSelectElement>) => ChangeState(e.target.value, lawyer.lawyerId)}
                              disabled={lawyer.statusAfterValidation == "OAB Validada"}
                              style={{float:'right'}}
                            >
                              <option value='SP'>SP</option>
                              <option value='RJ'>RJ</option>
                              <option value='MG'>MG</option>
                              <option value='AC'>AC</option>
                              <option value='AL'>AL</option>
                              <option value='AP'>AP</option>
                              <option value='AM'>AM</option>
                              <option value='BA'>BA</option>
                              <option value='CE'>CE</option>
                              <option value='DF'>DF</option>
                              <option value='ES'>ES</option>
                              <option value='GO'>GO</option>
                              <option value='MA'>MA</option>
                              <option value='MT'>MT</option>
                              <option value='MS'>MS</option>
                              <option value='PA'>PA</option>
                              <option value='PB'>PB</option>
                              <option value='PR'>PR</option>
                              <option value='PE'>PE</option>
                              <option value='PI'>PI</option>
                              <option value='RN'>RN</option>
                              <option value='RS'>RS</option>
                              <option value='RO'>RO</option>
                              <option value='RR'>RR</option>
                              <option value='SC'>SC</option>
                              <option value='SE'>SE</option>
                              <option value='TO'>TO</option>                
                            </select>
                            <br />

                            <input
                              disabled={lawyer.statusAfterValidation == "OAB Validada"}
                              type='text'
                              id='numeroOAB'
                              placeholder='Nº OAB (sem UF)'
                              onChange={(e: ChangeEvent<HTMLInputElement>) => ChangeOAB(e.target.value, lawyer.lawyerId)}
                              onBlur={() => handleInputBlur(lawyer.lawyerId)}
                            />
                            <br />

                            <input
                              disabled={lawyer.statusAfterValidation == "OAB Validada"}
                              type='text'
                              id='nome'
                              placeholder='Nome do Advogado'
                              value={lawyer.lawyerName}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => ChangeName(lawyer.lawyerId, e.target.value, 'I', 'OAB Não Encontrada')}
                            />
                            <br /><br />

                            {lawyer.statusAfterValidation == "OAB Validada" && (
                              <div style={{fontSize:'9px', width:'130px'}}>
                                <label style={{color:'#19a50d'}}>
                                  {lawyer.statusAfterValidation}
                                </label>
                              </div>
                            )}

                            {lawyer.statusAfterValidation != "OAB Validada" && (
                              <div style={{fontSize:'9px', width:'130px'}}>
                                <label style={{color:'#830404'}}>
                                  {lawyer.statusAfterValidation}
                                </label>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ))}

                    <div className='items'>
                      <p style={{cursor:'pointer', color:'blue', marginTop:'5px'}} onClick={() => NewLawyer(lawyerId)}>
                        <span> + Adicionar nova OAB</span>
                      </p>
                    </div>

                  </div>
                </div>
                <br />

                <div className='items'>Você atua em um escritório de advocacia ou departamento jurídico ?</div>
                <div className='itemsInput'>
                  <select onChange={(e: ChangeEvent<HTMLSelectElement>) => setCompanyType(e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="EA">Escritório de Advocacia</option>
                    <option value="DJ">Departamento Juridico</option>
                  </select>
                </div>
                <br />

                <div className='items'>Quantas pessoas estão na sua equipe jurídica ?</div>
                <div className='itemsInput'>
                  <select onChange={(e: ChangeEvent<HTMLSelectElement>) => setQuantity(e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="<=2">Até 2 Pessoas</option>
                    <option value="3-5">Entre 3 e 5 Pessoas</option>
                    <option value="6-10">Entre 6 e 10 Pessoas</option>
                    <option value=">10">Mais de 10 Pessoas</option>
                  </select>
                </div>
                <br />

                <div style={{fontWeight:600}} className='items'>Qual o principal objetivo que deseja atingir utilizando o GOJUR ? Escolha até 3 opções.</div>
                <div className='items' style={{fontSize:'9px'}}>Com estas informações nós iremos lhe ajudar no caminho de forma mais rápida.</div>
                <div style={{height:'20px'}}><>&nbsp;</></div>
                <div id='Ballon' className='items'>
                  <button type="button" className='itemsButton' style={{background: button0 ? 'var(--blue-twitter)' : '#FFFFFF', color: button0 ? '#FFFFFF' : '#000000'}} onClick={()=> ButtonClick(0, !button0)}>Controle Prazos Judiciais</button>&nbsp;&nbsp;
                  <button type="button" className='itemsButton' style={{background: button1 ? 'var(--blue-twitter)' : '#FFFFFF', color: button1 ? '#FFFFFF' : '#000000'}} onClick={()=> ButtonClick(1, !button1)}>Gestão de Processos</button>&nbsp;&nbsp;
                  <br />
                  <button type="button" className='itemsButton' style={{background: button2 ? 'var(--blue-twitter)' : '#FFFFFF', color: button2 ? '#FFFFFF' : '#000000'}} onClick={()=> ButtonClick(2, !button2)}>Monitorar Processos Tribunal</button>&nbsp;&nbsp;
                  <button type="button" className='itemsButton' style={{background: button3 ? 'var(--blue-twitter)' : '#FFFFFF', color: button3 ? '#FFFFFF' : '#000000'}} onClick={()=> ButtonClick(3, !button3)}>Receber Publicações</button>&nbsp;&nbsp;
                  <br />
                  <button type="button" className='itemsButton' style={{background: button4 ? 'var(--blue-twitter)' : '#FFFFFF', color: button4 ? '#FFFFFF' : '#000000'}} onClick={()=> ButtonClick(4, !button4)}>Automatizar Documentos</button>&nbsp;&nbsp;
                  <button type="button" className='itemsButton' style={{background: button5 ? 'var(--blue-twitter)' : '#FFFFFF', color: button5 ? '#FFFFFF' : '#000000'}} onClick={()=> ButtonClick(5, !button5)}>Gestão Equipe e Tarefas</button>&nbsp;&nbsp;
                  <br />
                  <button type="button" className='itemsButton' style={{background: button6 ? 'var(--blue-twitter)' : '#FFFFFF', color: button6 ? '#FFFFFF' : '#000000'}} onClick={()=> ButtonClick(6, !button6)}>Financeiro e Faturamento</button>&nbsp;&nbsp;
                  <button type="button" className='itemsButton' style={{background: button7 ? 'var(--blue-twitter)' : '#FFFFFF', color: button7 ? '#FFFFFF' : '#000000'}} onClick={()=> ButtonClick(7, !button7)}>Relac. com Cliente</button>&nbsp;&nbsp;
                  <br />
                  <button type="button" className='itemsButton' style={{background: button8 ? 'var(--blue-twitter)' : '#FFFFFF', color: button8 ? '#FFFFFF' : '#000000'}} onClick={()=> ButtonClick(8, !button8)}>Contratos e Assessoria</button>&nbsp;&nbsp;
                  <button type="button" className='itemsButton' style={{background: button9 ? 'var(--blue-twitter)' : '#FFFFFF', color: button9 ? '#FFFFFF' : '#000000'}} onClick={()=> ButtonClick(9, !button9)}>Melhorar Faturamento</button>&nbsp;&nbsp;
                </div>

                <div style={{height:'20px'}}><>&nbsp;</></div>
                <div id='Button' className='items'>
                  <p style={{cursor:'pointer', color:'blue', marginTop:'130px'}} onClick={() => Save()}>
                    <span style={{fontWeight:600}}>Clique aqui para Acessar o GOJUR</span>
                  </p>
                </div>
                <br /><br /><br />
              </CenterMobile>
            </Content>

            {hasError && <Overlay />}
            {hasError && (
              <ModalAlert>
                <div id='Header' style={{height:'30px', fontWeight:600}}>
                  <div className='menuTitle'>
                    &nbsp;&nbsp;&nbsp;&nbsp;ATENÇÃO
                  </div>
                  <div className='menuSection'>
                    &nbsp;
                  </div>
                </div>
                <br />

                <div style={{marginLeft:'20px'}}>
                  {errorCompanyType}{errorCompanyType != '' ? <br /> : ''}
                  {errorQuantity}{errorQuantity != '' ? <br /> : ''}
                  {errorQtt}{errorQtt != '' ? <br /> : ''}
                  {errorName}{errorName != '' ? <br /> : ''}
                  <br /><br />
                </div>
                <div style={{float:'left', marginLeft:'240px'}}>
                  <button 
                    className="buttonClick"
                    type='button'
                    onClick={()=> CloseModal()}
                    style={{width:'100px'}}
                  >
                    <FaCheck />
                    Ok
                  </button>
                </div>
                <br /><br />
              </ModalAlert>
            )}
          </Container>
        )}
      </Modal>
    </>
  )
}

export default FirstAccessModal;