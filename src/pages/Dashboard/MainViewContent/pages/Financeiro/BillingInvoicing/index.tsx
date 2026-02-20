/* eslint-disable-next-line */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-return-assign */
/* eslint no-unneeded-ternary: "error" */
/* eslint-disable react/jsx-one-expression-per-line */

import React, { useEffect, useState, useCallback, ChangeEvent, useRef } from 'react';
import api from 'services/api';
import DatePicker from 'components/DatePicker';
import IntlCurrencyInput from "react-intl-currency-input";
import Select from 'react-select';
import ModalOptions from 'components/ModalOptions';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { languageGridEmpty } from 'Shared/utils/commonConfig';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import { useStateContext } from 'context/statesContext';
import { useDelay, currencyConfig, selectStyles, FormatCurrency, FormatFileName, AmazonPost } from 'Shared/utils/commonFunctions';
import { useModal } from 'context/modal';
import { IoIosPaper } from 'react-icons/io';
import { BiSave } from 'react-icons/bi'
import { BsImage } from 'react-icons/bs';
import { CgFileDocument } from 'react-icons/cg';
import { FaCheck, FaRegTimesCircle, FaRegCopy, FaFileAlt, FaFilePdf, FaWhatsapp } from 'react-icons/fa';
import { FiTrash, FiEdit, FiX, FiDownloadCloud, FiMail, FiChevronDown } from 'react-icons/fi';
import { HiDocumentText } from 'react-icons/hi';
import { ImMenu3, ImMenu4 } from 'react-icons/im';
import { MdHelp, MdAttachMoney } from 'react-icons/md';
import { RiFolder2Fill, RiEraserLine } from 'react-icons/ri';
import { SiMicrosoftexcel } from 'react-icons/si';
import { useMenuHamburguer } from 'context/menuHamburguer'
import MenuHamburguer from 'components/MenuHamburguer';
import { useDevice } from "react-use-device";
import { Overlay } from 'Shared/styles/GlobalStyle';
import { useLocation } from 'react-router-dom'
import { useHistory } from 'react-router-dom';
import { useToast } from 'context/toast';
import { parcelas, parcelasDatas, financialReminders } from 'Shared/utils/commonListValues';
import { languageGridPagination } from 'Shared/utils/commonConfig';
import { format } from 'date-fns';
import { HeaderPage } from 'components/HeaderPage';
import LogModal from 'components/LogModal';
import { DataTypeProvider, PagingState, CustomPaging, IntegratedPaging, SortingState, IntegratedSorting } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import GridSelectProcess from '../../Dashboard/resorces/DashboardComponents/CreateAppointment/GridSelectProcess';
import { ISelectData, MatterData, IMovementUploadFile } from '../Interfaces/IFinancial';
import { IPayments } from '../Interfaces/IPayments';
import FinancialPaymentModal from '../PaymentModal';
import FinancialDocumentModal from '../DocumentModal';
import { ModalDeleteOptions, OverlayFinancial } from '../styles';
import { Container, Content, Process, GridSubContainer, ModalPaymentInformation, HamburguerHeader } from './styles';

const BillingInvoicing: React.FC = () => {
    const { isMenuOpen, handleIsMenuOpen, isOpenMenuDealDefaultCategory, handleIsOpenMenuDealDefaultCategory } = useMenuHamburguer();
    const { isConfirmMessage, isCancelMessage, handleCancelMessage, handleConfirmMessage, caller } = useConfirmBox();
    const { handleStateType } = useStateContext();
    const token = localStorage.getItem('@GoJur:token');
    const { pathname } = useLocation();
    const history = useHistory();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { isMOBILE } = useDevice();
    const { handleSelectProcess, selectProcess, matterSelected, openSelectProcess } = useModal();
    const [accountId, setAccountId] = useState('');
    const [movementId, setMovementId] = useState<number>();
    const [movementType, setMovementType] = useState('');
    const [paymentFormList, setPaymentFormList] = useState<ISelectData[]>([]);
    const [paymentFormId, setPaymentFormId] = useState('');
    const [paymentFormDescription, setPaymentFormDescription] = useState<string>("")
    const [paymentFormTerm, setPaymentFormTerm] = useState('');
    const [categoryList, setCategoryList] = useState<ISelectData[]>([]);
    const [categoryId, setCategoryId] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [categoryTerm, setCategoryTerm] = useState('');
    const [centerCostList, setCenterCostList] = useState<ISelectData[]>([]);
    const [centerCostId, setCenterCostId] = useState('');
    const [centerCostDescription, setCenterCostDescription] = useState<string>('')
    const [centerCostTerm, setCenterCostTerm] = useState('');
    const [peopleList, setPeopleList] = useState<ISelectData[]>([]);
    const [peopleId, setPeopleId] = useState('');
    const [peopleDescription, setPeopleDescription] = useState<string>('');
    const [peopleTerm, setPeopleTerm] = useState('');
    const [paymentList, setPaymentList] = useState<IPayments[]>([]);
    const [paymentMessage, setPaymentMessage] = useState<string>('');
    const [movementDate, setMovementDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
    const [movementValue, setMovementValue] = useState<number>();
    const [movementParcelas, setMovementParcelas] = useState('1');
    const [movementParcelasFirst, setMovementParcelasFirst] = useState('1');
    const [movementParcelasDatas, setMovementParcelasDatas] = useState('M');
    const [showParcelasDatas, setShowParcelasDatas] = useState<boolean>(false);
    const [taxInvoice, setTaxInvoice] = useState<string>('');
    const [movementDescription, setMovementDescription] = useState('');
    const [selectedPeopleList, setSelectedPeopleList] = useState<ISelectData[]>([]);
    const [selectedPeople, setSelectedPeople] = useState<ISelectData>();   
    const [showNotifyPeople, setShowNotifyPeople] = useState<boolean>(false);
    const [checkPeopleList, setCheckPeopleList] = useState<boolean>(false);
    const [reminders, setReminders] = useState('00');
    const [flgNotifyPeople, setFlgNotifyPeople] = useState<boolean>(false);
    const [flgNotifyEmail, setFlgNotifyEmail] = useState<boolean>(true);
    const [flgNotifyWhatsApp, setFlgNotifyWhatsApp] = useState<boolean>(false);
    const [flgReembolso, setFlgReembolso] = useState<boolean>(false);
    const [flgStatus, setFlgStatus] = useState('A');
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [actionSave, setActionSave] = useState<string>('');
    const [showModalOptions, setShowModalOptions] = useState<boolean>(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
    const [showDeleteOptions, setShowDeleteOptions] = useState<boolean>(false);
    const [showDocumentModal, setShowDocumentModal] = useState<boolean>(false);
    const [showPaymentInformation, setShowPaymentInformation] = useState<boolean>(false);
    const [paymentQtd, setPaymentQtd] = useState('');
    const [matterId, setMatterId] = useState('');
    const [processTitle, setProcessTitle] = useState('Associar Processo');
    const [blockAssociateMatter, setBlockAssociateMatter] = useState(false);
    const [appointmentMatter, setAppointmentMatter] = useState<MatterData | undefined>({} as MatterData);
    const [matterAttachedModal, setMatterAttachedModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
    const [enablePayments, setEnablePayments] = useState<boolean>(true);
    const [showPayments, setShowPayments] = useState<boolean>(false);
    const [showChangeInstallments, setShowChangeInstallments] = useState<boolean>(false);
    const [changeInstallments, setChangeInstallments] = useState<boolean>(false);
    const [invoice, setInvoice] = useState<number>(0);
    const [sequence, setSequence] = useState<string>('');
    const [uploadingStatus, setUploadingStatus] = useState<string>('none');
    const [filesUploadIds, setFilesUploadIds] = useState<Number[]>([]);
    const [isDeletingFile, setIsDeletingFile] = useState<boolean>(false);
    const [documentList, setDocumentList] = useState<IMovementUploadFile[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [tokenContinuation, setTokenContinuation] = useState<string | null>('');
    const [showLog, setShowLog] = useState(false);
    const ref = useRef<any>(null);
    const DateFormatter = ({ value }) => format(new Date(value), 'dd/MM/yyyy HH:mm');
    const DateTypeProvider = props => (
        <DataTypeProvider formatterComponent={DateFormatter} {...props} />
    )

    const [isOpen, setIsOpen] = useState(false);


const Initialize = async () => {
    await LoadStates()
}

    
const LoadStates = async() => {
    const indexId1 = pathname.indexOf('id=')

    const params = new URLSearchParams(location.search);
    const instalmentIdParam = Number(params.get('instalmentId'));

    setMovementId(instalmentIdParam)
}


  useEffect(() => {
    Initialize()
  }, [])


useEffect(() => {
    if(movementId != 0)
    {
        LoadMovement(movementId)
    }
}, [movementId])
    

    const LoadMovement = async (movementId) => {
        try {
          setIsLoading(true);
    
          const response = await api.get('/Financeiro/Editar', { params:{ id: Number(movementId), token }})
          
          
          //setMovementDate(format(new Date(response.data.dta_Movimento), "yyyy-MM-dd"))
          setMovementValue(response.data.vlr_Movimento)
          
            /*
          setMovementType(movementType)
          setMovementParcelas(response.data.qtd_Parcelamento.toString())
          setMovementParcelasFirst(response.data.qtd_Parcelamento.toString())
          setMovementParcelasDatas(response.data.Periodicidade)
          setPaymentFormId(response.data.cod_FormaPagamento)
          setPaymentFormDescription(response.data.des_FormaPagamento)
          setCategoryId(response.data.cod_Categoria)
          setCategoryDescription(response.data.nom_Categoria)
          setCenterCostId(response.data.cod_CentroCusto)
          setCenterCostDescription(response.data.des_CentroCusto)
          setTaxInvoice(response.data.num_NotaFiscal)
          setMovementDescription(response.data.des_Movimento)
          */
          
            const selectedItem = response.data.UserList.find(item =>
                item.label.toLowerCase().includes("cliente")
            );
           
        
            setSelectedPeople(selectedItem)
          
          /*
          setFlgNotifyPeople(response.data.flg_NotificaPessoa)
          setFlgNotifyEmail(response.data.flg_NotificaEmail)
          setFlgNotifyWhatsApp(response.data.flg_NotificaWhatsApp)
          setReminders(response.data.Lembrete)
          setShowNotifyPeople(response.data.UserList.length > 0 && response.data.Lembrete != null)
          setFlgReembolso(response.data.flg_Reembolso)
          setFlgStatus(response.data.flg_Status)
          setShowParcelasDatas(response.data.qtd_Parcelamento != "1")
          setAccountId(response.data.cod_Conta)
          setPaymentQtd(response.data.qtd_Parcelamento)
          setInvoice(response.data.cod_FaturaParcela)
          setSequence(response.data.num_SequenciaFatura)
    
          if(response.data.qtd_Parcelamento != "1"){
            setEnablePayments(false)
          }
    
          if(response.data.cod_Processo != null)
          {
            setMatterId(response.data.cod_Processo)
            setProcessTitle(`${response.data.num_Processo} - ${response.data.matterCustomerDesc} x ${response.data.matterOpposingDesc}`)
          }
            
          await LoadPayments()
          await LoadDocuments()
    
          */

          setIsLoading(false);
        }
        catch (err:any) {
          setIsLoading(false)
          addToast({type: "info", title: "Operação não realizada", description: err.response.data.Message})
        }
      }



    const CustomCell = (props) => {
        const { column } = props;

        if (column.title === 'Download') {
            return (
                <Table.Cell onClick={(e) => handleClick(props)} {...props}>
                    &nbsp;&nbsp;
                    <FiDownloadCloud title="Clique para fazer o download do arquivo" />
                </Table.Cell>
            );
        }

        if (column.title === '') {
            const imageExtensions = ['gif', 'png', 'svg', 'jpg', 'jpeg']
            const docExtension = ['pdf', 'doc', 'docx']
            const planExtensions = ['xlsx', 'xls']

            return (
                <Table.Cell onClick={(e) => handleClick(props)} {...props}>
                    &nbsp;&nbsp;
                    {/* image extensions image */}
                    {(imageExtensions.includes(props.row.fileType) &&
                        <BsImage title='Clique para fazer o download desta imagem' />
                    )}
                    {(planExtensions.includes(props.row.fileType) &&
                        <SiMicrosoftexcel title='Clique para fazer o download desta planilha' />
                    )}
                    {(docExtension.includes(props.row.fileType) &&
                        <FaFilePdf title='Clique para fazer o download deste documento' />
                    )}
                    {((!imageExtensions.includes(props.row.fileType)
                        && !planExtensions.includes(props.row.fileType)
                        && !docExtension.includes(props.row.fileType)) &&
                        <HiDocumentText title='Clique para fazer o download deste documento' />
                    )}
                </Table.Cell>
            );
        }

        if (column.title === 'Excluir') {
            return (
                <Table.Cell onClick={(e) => handleClick(props)} {...props}>
                    <FiTrash title="Clique para remover o arquivo" />
                </Table.Cell>
            );
        }

        return <Table.Cell {...props} />;
    };


    const handleClick = (props: any) => {
        // call download function
        if (props.column.name === 'download' || props.column.name === '') {
            //handleDownloadFile(props.row.fileName)
        }

        // call delete function
        if (props.column.name === 'delete') {
            //handleDeleteFile(props.row.fileName)
        }
    }


    const [tableColumnExtensions] = useState([
        { columnName: '', width: '8%' },
        { columnName: 'Parcela', width: '30%' },
        { columnName: 'Vencimento', width: '30%' },
        { columnName: 'FormaPagto', width: '8%' },
        { columnName: 'Valor', width: '8%' },
        { columnName: 'Status', width: '8%' },
        { columnName: 'acoes', width: '8%' },
        { columnName: 'Observacao', width: '8%' }


    ]);


    const [dateColumns] = useState(['dateUpload']);
    const columns = [
        { name: '', title: '' },
        { name: 'Parcela', title: 'Parcela' },
        { name: 'Vencimento', title: 'Vencimento' },
        { name: 'FormaPagto', title: 'Forma Pagto' },
        { name: 'Valor', title: 'Valor' },
        { name: 'Status', title: 'Status' },
        { name: 'acoes', title: 'Ações' },
        { name: 'Observacao', title: 'Observação' }

    ];

    return (

        <Container>
            <HeaderPage />

            <HamburguerHeader>
                <div style={{ float: 'right' }} className='buttonHamburguer'>
                    <button
                        type="button"
                        onClick={() => handleIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <ImMenu4 className='iconMenu' /> : <ImMenu3 className='iconMenu' />}
                    </button>

                    {isMenuOpen ? (
                        <MenuHamburguer name='financeOptions' />
                    ) : null}
                </div>
            </HamburguerHeader>

            <Content>

                {isLoading || isSaving && (
                    <>
                        <Overlay />
                        <div className='waitingMessage'>
                            <LoaderWaiting size={15} color="var(--blue-twitter)" />
                            {isSaving ? 'Salvando...' : 'Aguarde...'}
                        </div>
                    </>
                )}


                <div style={{ height: '200px' }}>
                    <div style={{ float: 'left', width: '60%' }}>

                        {/*
                        <div>
                            <span>FATURAMENTO</span>
                        </div>
                         <br />
                         */}



                        <section id='FirstElements'>

                            <label htmlFor="valor">
                                Cliente
                                <input
                                    type="text"
                                    className='inputField'
                                    maxLength={20}
                                    value={selectedPeople?.label || ''}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTaxInvoice(e.target.value)}
                                />
                            </label>

                            <label htmlFor='Data'>
                                <DatePicker
                                    title="Emissão"
                                    value={movementDate}
                                />
                            </label>


                        </section>

                        <section id='SecondElements'>
                            <label htmlFor="valor">
                                Descrição
                                <input
                                    type="text"
                                    className='inputField'
                                    maxLength={20}
                                    value={taxInvoice}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTaxInvoice(e.target.value)}
                                />
                            </label>

                            <label>
                                Régua de Cobrança
                                <Select
                                    isSearchable
                                    isClearable
                                    value={{ id: paymentFormId, label: paymentFormDescription }}
                                    onInputChange={(term) => setPaymentFormTerm(term)}
                                    required
                                    placeholder=""
                                    styles={selectStyles}
                                    options={paymentFormList}
                                />
                            </label>

                        </section>

                    </div>


                    <div style={{ float: 'left', width: '30%', marginLeft: '5%' }}>
                        <br />
                        <div className="mini-invoice">
                            <div className="mini-top">
                                <span className="mini-number">Fat. 000001</span>
                                <span className="mini-status aberta">ABERTA</span>
                            </div>

                            <div className="mini-installment">
                                Parcela 2/4
                            </div>

                            <div className="mini-value">
                                R$ {movementValue}

                            </div>
                        </div>

                    </div>

                </div>

                <br />

                <GridSubContainer style={{ pointerEvents: (isDeletingFile ? 'none' : 'all') }}>
                    <Grid
                        rows={documentList}
                        columns={columns}
                    >
                        <SortingState
                            defaultSorting={[{ columnName: 'dateUpload', direction: 'desc' }]}
                        />
                        <IntegratedSorting />
                        <PagingState
                            currentPage={currentPage}
                            pageSize={pageSize}
                            onCurrentPageChange={setCurrentPage}
                            onPageSizeChange={setPageSize}
                        />
                        <IntegratedPaging />
                        <CustomPaging totalCount={totalRows} />
                        <DateTypeProvider for={dateColumns} />
                        <Table
                            cellComponent={CustomCell}
                            columnExtensions={tableColumnExtensions}
                            messages={languageGridEmpty}
                        />
                        <TableHeaderRow showSortingControls />
                        <PagingPanel
                            messages={languageGridPagination}
                        />
                    </Grid>

                </GridSubContainer>
                <br />

                <div id='Buttons'>
                    <div className='log'>
                        {movementId != "0" && (
                            <button type="button" id="log">
                                <div style={{ float: 'left' }}><IoIosPaper title="Ver Historico" /></div>
                                <div style={{ float: 'left' }}>&nbsp;Ver Histórico</div>
                            </button>
                        )}
                    </div>

                    <div style={{ float: 'right' }}>
                        <button
                            className="buttonClick"
                            type='button'
                            onClick={() => Save('')}
                        >

                            Gerar Fatura
                        </button>

                        {(movementId != '0' && invoice == 0) && (
                            <button
                                className="buttonClick"
                                type='button'
                                onClick={() => Copy()}
                            >

                                Salvar
                            </button>
                        )}

                        {(!isMOBILE && movementId != '0' && invoice == 0) && (
                            <button
                                className="buttonClick"
                                type='button'
                                onClick={() => GenerateDocument()}
                            >

                                Emitir Fatura
                            </button>
                        )}

                        {(movementId != '0' && invoice == 0) && (
                            <button
                                className="buttonClick"
                                type='button'
                                onClick={() => CheckDeleteType(paymentQtd)}
                            >

                                Enviar Fatura Email
                            </button>
                        )}

                        <button
                            type="button"
                            className="buttonClick dropdownButton"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            Mais Ações
                            <FiChevronDown
                                className={`dropdownIcon ${isOpen ? "rotate" : ""}`}
                            />
                        </button>

                        {isOpen && (
                            <div className="dropdownMenu">
                                <button className="dropdownItem">Gerar Boletos Selecionados</button>
                                <button className="dropdownItem">Excluir Todos os Boletos</button>
                                <button className="dropdownItem">Excluir Fatura</button>
                            </div>
                        )}


                    </div>
                </div>
                <br />

                {isMOBILE && (
                    <>
                        <br /><br /><br /><br /><br /><br /><br />
                    </>
                )}

                &nbsp;
            </Content>

            {(showPaymentModal) && <OverlayFinancial />}
            {(showPaymentModal) && <FinancialPaymentModal callbackFunction={{ movementId, ClosePaymentModal }} />}

            {showModalOptions && (
                <ModalOptions
                    description="Este movimento está parcelado, deseja atualizar também as outras parcelas ?"
                    close={() => setShowModalOptions(false)}
                    callback={handleCallback}
                />
            )}

            {(showDeleteOptions) && <OverlayFinancial />}
            {showDeleteOptions && (
                <ModalDeleteOptions>
                    <div className='menuSection'>
                        <FiX onClick={(e) => { setShowDeleteOptions(false) }} />
                    </div>
                    <div style={{ marginLeft: '5%' }}>
                        Este movimento está parcelado, deseja excluir também as outras parcelas ?
                        <br />
                        <br />
                        <br />
                        <div style={{ float: 'right', marginRight: '7%', bottom: 0 }}>
                            <div style={{ float: 'left' }}>
                                <button
                                    className="buttonClick"
                                    type='button'
                                    onClick={() => Delete(false)}
                                    style={{ width: '120px' }}
                                >
                                    Excluir este
                                </button>
                            </div>

                            <div style={{ float: 'left' }}>
                                <button
                                    className="buttonClick"
                                    type='button'
                                    onClick={() => Delete(true)}
                                    style={{ width: '120px' }}
                                >
                                    Excluir todos
                                </button>
                            </div>

                            <div style={{ float: 'left', width: '100px' }}>
                                <button
                                    type='button'
                                    className="buttonClick"
                                    onClick={() => { setShowDeleteOptions(false) }}
                                    style={{ width: '100px' }}
                                >
                                    <FaRegTimesCircle />
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>

                </ModalDeleteOptions>
            )}

            {(showConfirmDelete) && <OverlayFinancial />}
            {showConfirmDelete && (
                <ModalDeleteOptions>
                    <div className='menuSection'>
                        <FiX onClick={(e) => { setShowConfirmDelete(false) }} />
                    </div>
                    <div style={{ marginLeft: '5%' }}>
                        Confirma a Exclusão ?
                        <br />
                        <br />
                        <div style={{ float: 'right', marginRight: '7%', bottom: 0 }}>
                            <div style={{ float: 'left' }}>
                                <button
                                    className="buttonClick"
                                    type='button'
                                    onClick={() => Delete(false)}
                                    style={{ width: '100px' }}
                                >
                                    <FaCheck />
                                    Sim
                                </button>
                            </div>

                            <div style={{ float: 'left', width: '100px' }}>
                                <button
                                    type='button'
                                    className="buttonClick"
                                    onClick={() => { setShowConfirmDelete(false) }}
                                    style={{ width: '100px' }}
                                >
                                    <FaRegTimesCircle />
                                    Não
                                </button>
                            </div>
                        </div>
                    </div>

                </ModalDeleteOptions>
            )}

            {(showPaymentInformation) && <OverlayFinancial />}
            {showPaymentInformation && (
                <ModalPaymentInformation>
                    <div className='menuSection'>
                        <FiX onClick={(e) => { setShowPaymentInformation(false) }} />
                    </div>
                    <div style={{ marginLeft: '5%' }}>
                        Você esta em um processo de inclusão do registo, para prosseguir é necessário salva-lo, deseja realizar este processo agora ?
                        <br />
                        <br />
                        <div style={{ float: 'right', marginRight: '7%', bottom: 0 }}>
                            <div style={{ float: 'left' }}>
                                <button
                                    className="buttonClick"
                                    type='button'
                                    onClick={() => SaveByPaymentInformation()}
                                    style={{ width: '100px' }}
                                >
                                    <FaCheck />
                                    Sim
                                </button>
                            </div>

                            <div style={{ float: 'left', width: '100px' }}>
                                <button
                                    type='button'
                                    className="buttonClick"
                                    onClick={() => { setShowPaymentInformation(false) }}
                                    style={{ width: '100px' }}
                                >
                                    <FaRegTimesCircle />
                                    Não
                                </button>
                            </div>
                        </div>
                    </div>

                </ModalPaymentInformation>
            )}

            {showChangeInstallments && (
                <ConfirmBoxModal
                    title="Alterar parcelas do movimento"
                    caller="changeDefaultHeader"
                    useCheckBoxConfirm
                    message="Foi alterado o número de parcelas do movimento, o reparcelamento implica em alterar todas as parcelas considerando os dados do movimento atual. Eventuais liquidações serão mantidas desde que a parcela não seja removida (no caso de redução de parcelas)."
                />
            )}

            {isLoading && (
                <>
                    <Overlay />
                    <div className='waitingMessage'>
                        <LoaderWaiting size={15} color="var(--blue-twitter)" />
                        &nbsp;&nbsp; Carregando...
                    </div>
                </>
            )}

            {/* warning uploading file */}
            {(uploadingStatus != 'none') && (
                <>
                    <OverlayFinancial />
                    <div className='waitingMessage'>
                        <LoaderWaiting size={15} color="var(--blue-twitter)" />
                        &nbsp;&nbsp;
                        Carregando Arquivos...
                    </div>
                </>
            )}

            {/* warning uploading file */}
            {(isDeletingFile) && (
                <>
                    <OverlayFinancial />
                    <div className='waitingMessage'>
                        <LoaderWaiting size={15} color="var(--blue-twitter)" />
                        &nbsp;&nbsp;
                        Deletando Arquivo...
                    </div>
                </>
            )}

            {showLog && (
                <LogModal
                    idRecord={Number(movementId)}
                    handleCloseModalLog={handleCloseLog}
                    logType="movementLog"
                />
            )}

        </Container>
    );
};

export default BillingInvoicing;
