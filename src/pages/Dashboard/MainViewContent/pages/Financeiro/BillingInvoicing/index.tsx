/* eslint-disable-next-line */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-return-assign */
/* eslint no-unneeded-ternary: "error" */
/* eslint-disable react/jsx-one-expression-per-line */

import React, { useEffect, useState, useCallback, ChangeEvent, useRef, useMemo  } from 'react';
import api from 'services/api';
import DatePicker from 'components/DatePicker';
import { RiMailSendLine } from "react-icons/ri";
import IntlCurrencyInput from "react-intl-currency-input";
import Select from 'react-select';
import ModalOptions from 'components/ModalOptions';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { languageGridEmpty } from 'Shared/utils/commonConfig';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import { useStateContext } from 'context/statesContext';
import { FaBarcode } from "react-icons/fa";
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
import { TableColumnVisibility } from '@devexpress/dx-react-grid-material-ui';
import GridSelectProcess from '../../Dashboard/resorces/DashboardComponents/CreateAppointment/GridSelectProcess';
import { IPayments } from '../Interfaces/IPayments';
import FinancialPaymentModal from '../PaymentModal';
import FinancialInvoicingModal from '../InvoicingModal';
import FinancialDocumentModal from '../DocumentModal';
import { ModalDeleteOptions, OverlayFinancial } from '../styles';
import { Container, Content, Process, GridSubContainer, ModalPaymentInformation, HamburguerHeader } from './styles';
import { IBillingRuler, IBillingRulerWarning } from '../BillingRule/Interfaces/IBillingRuler';
import { ListCustomerPersonData, ListLawyerData, ListOpossingData, ListPartsData, ListThirdyData } from '../../Matter/EditComponents/Services/PeopleData';


interface IOption {
    value: number;
    label: string;
}

interface IPaymentFormData {
    paymentFormId: string;
    paymentFormDescription: string;
    paymentFormType: string;
    count: string;
}

interface IFinancial {
    cod_Movimento: string;
    dta_Movimento: string;
    dta_Liquidacao: string;
    des_Movimento: string;
    nom_Categoria: string;
    tpo_Movimento: string;
    cod_FormaPagamento: string;
    vlr_Movimento_Contabil: string;
    vlr_Liquidacao_Contabil: string;
    qtd_Parcelamento: string;
    num_Parcela: string;
    matterCustomerDesc: string;
    matterOpposingDesc: string;
    userNames: string;
    num_Processo: string;
    totalRecords: number;
    cod_FaturaParcela: number;
    cod_Acordo: string;
    parcelaFormatada?: string;
    cod_Fatura2Movimento?: string;
    des_Observacao?: string;
}

interface ISelectData {
    id: string;
    label: string;
}

interface BillingInvoicingPayload {
  invoiceId: number;
  companyId: number;
  invoiceNumber: number;
  personId?: number;
  personName?: string;
  personIdOld?: number;
  billingRulerId?: number | null;
  invoiceDescription: string;
  issueDate: string;
  movementId: number;
  token: string;
}

const BillingInvoicing: React.FC = () => {
    const { isMenuOpen, handleIsMenuOpen, isOpenMenuDealDefaultCategory, handleIsOpenMenuDealDefaultCategory } = useMenuHamburguer();
    const { isConfirmMessage, isCancelMessage, handleCancelMessage, handleConfirmMessage, caller } = useConfirmBox();
    const { handleStateType } = useStateContext();
    const token = localStorage.getItem('@GoJur:token');
    const companyId = localStorage.getItem('@GoJur:companyId');
    const { pathname } = useLocation();
    const history = useHistory();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { isMOBILE } = useDevice();
    const { handleSelectProcess, selectProcess, matterSelected, openSelectProcess } = useModal();
    const [accountId, setAccountId] = useState('');
    const [movementId, setMovementId] = useState('');
    const [movementIdEdit, setMovementIdEdit] = useState('');

    const [movementType, setMovementType] = useState('');
    //const [paymentFormList, setPaymentFormList] = useState<ISelectData[]>([]);
    const [paymentFormId, setPaymentFormId] = useState('');
    const [paymentFormDescription, setPaymentFormDescription] = useState<string>("")
    const [paymentFormType, setPaymentFormType] = useState<string>('B');

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
    const [invoiceDate, setInvoiceDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
    const [movementValue, setMovementValue] = useState<number>();
    const [invoiceValue, setInvoiceValue] = useState<number>();
    const [movementParcelas, setMovementParcelas] = useState('1');
    const [movementNumParcela, setMovementNumParcela] = useState('1');

    const [movementParcelasFirst, setMovementParcelasFirst] = useState('1');
    const [movementParcelasDatas, setMovementParcelasDatas] = useState('M');
    const [showParcelasDatas, setShowParcelasDatas] = useState<boolean>(false);
    const [taxInvoice, setTaxInvoice] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [movementDescription, setMovementDescription] = useState('');
    const [selectedPeopleList, setSelectedPeopleList] = useState<ISelectData[]>([]);
    const [selectedPeople, setSelectedPeople] = useState<ISelectData>();
    const [selectedPeopleOld, setSelectedPeopleOld] = useState<ISelectData>();
    
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
    const [enablePayments, setEnablePayments] = useState<boolean>(true);
    const [showPayments, setShowPayments] = useState<boolean>(false);
     const [changeCustomer, setChangeCustomer] = useState<boolean>(false);
    const [changeInstallments, setChangeInstallments] = useState<boolean>(false);
    const [invoice, setInvoice] = useState<number>(0);
    const [sequence, setSequence] = useState<string>('');
    const [uploadingStatus, setUploadingStatus] = useState<string>('none');
    const [filesUploadIds, setFilesUploadIds] = useState<Number[]>([]);
    const [isDeletingFile, setIsDeletingFile] = useState<boolean>(false);
    const [documentList, setDocumentList] = useState<IMovementUploadFile[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [tokenContinuation, setTokenContinuation] = useState<string | null>('');
    const [showLog, setShowLog] = useState(false);
    const ref = useRef<any>(null);
    const DateFormatter = ({ value }) => format(new Date(value), 'dd/MM/yyyy HH:mm');
    const DateTypeProvider = props => (
        <DataTypeProvider formatterComponent={DateFormatter} {...props} />
    )

    const [isOpen, setIsOpen] = useState(false);
    const [invoiceId, setInvoiceId] = useState<number>(0);
    const [invoiceNumber, setInvoiceNumber] = useState<string>('000000');
    const [movementList, setMovementList] = useState<IFinancial[]>([]);
    const [billingRulerList, setBillingRulerList] = useState<IOption[]>([]);
    const [paymentFormList, setPaymentFormList] = useState<IPaymentFormData[]>([]);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [selectedBillingRuler, setSelectedBillingRuler] = useState<ISelectData | null>(null);
    const [buttonFatura, setButtonFatura] = useState<string>('Gerar Fatura');
    const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
    const [visualizeType, setVisualizeType] = useState('V');
    const [customerList, setCustomerList] = useState<ISelectData[]>([])
    const [showChangeCustomer, setShowChangeCustomer] = useState<boolean>(false);
    const [billingInvoicing, setBillingInvoicing] = useState<BillingInvoicingPayload>({
        invoiceId: 0,
        companyId: 0,
        invoiceNumber: 0,
        personId: undefined,
        personName: "",
        personIdOld: undefined,
        billingRulerId: null,
        invoiceDescription: "",
        issueDate: "",
        movementId: 0,
        token: ""
    });
    const [confirmDeleteModal, setConfirmDeleteModal] = useState<boolean>(false);

useEffect(() => {
    if (isCancelMessage && caller === 'changeDefaultHeade1')
    {
    setShowChangeCustomer(false)
    //setShowChangeCustomer(false)
    handleCancelMessage(false)
    }

    if (isCancelMessage && caller == "invoiceDelete") {
        setConfirmDeleteModal(false)
        handleCancelMessage(false)
    }

}, [isCancelMessage, caller]);



useEffect(() => {
    if(isConfirmMessage && caller === 'changeDefaultHeade1')
    {
        handleSave();
        setShowChangeCustomer(false)
        handleConfirmMessage(false)
    }

  
    if (isConfirmMessage && caller == "invoiceDelete") {
        handleDeleteInvoice(invoiceId, true)
        handleConfirmMessage(false)
    }

}, [isConfirmMessage, caller]);


    const handleSelectRow = (rowId: number) => {
        setSelectedRows(prev =>
            prev.includes(rowId)
                ? prev.filter(id => id !== rowId)
                : [...prev, rowId]
        );
    };

    const handleSelectAll = () => {
        if (selectedRows.length === movementList.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(movementList.map(item => item.parcelaFormatada));

        }
    };

    const Initialize = async () => {
        await PaymentFormList();
        await LoadStates()
        setCustomerList(await ListCustomerPersonData(""))
    }


    const LoadStates = async () => {
        const indexId1 = pathname.indexOf('id=')

        const params = new URLSearchParams(location.search);
        const instalmentIdParam = Number(params.get('instalmentId'));

        setMovementId(instalmentIdParam.toString())
    }


    useEffect(() => {
        Initialize()
    }, [])


    useEffect(() => {
        const loadData = async () => {
            if (movementId !== '' && movementId !== '0') {
                const responseBilling = await LoadBillingInvoicing(movementId);
                await LoadMovement(movementId, responseBilling?.invoiceDescription);

            }
        };

        loadData();
    }, [movementId]);




    useEffect(() => {

        if (Number(movementNumParcela) > 1 && Number(invoiceId) === 0) {
            addToast({ type: "info", title: "Operação não realizada", description: "Para faturar um parcelamento realize a operação a partir da primeira parcela" })
            handleStateType('Inactive');
            history.push(`/financeiro`)
        }

    }, [movementNumParcela, invoiceId])


    const LoadMovement = async (movementId, invoiceDescription) => {
        try {
            setIsLoading(true);

            const response = await api.get('/Financeiro/Editar', { params: { id: Number(movementId), token } })

          
            setMovementValue(response.data.vlr_Movimento)
        
            setMovementDate(
                format(new Date(response.data.dta_Movimento), "yyyy-MM-dd")
            );

            setMovementParcelas(response.data.num_Parcela.toString() + '/' + response.data.qtd_Parcelamento.toString())

            setMovementNumParcela(response.data.num_Parcela)

            setPaymentFormId(response.data.cod_FormaPagamento)
            setPaymentFormDescription(response.data.des_FormaPagamento)

            const selectedItem = response.data.UserList.find(item =>
                item.label.toLowerCase().includes("cliente")
            );

         
            setSelectedPeople(selectedItem)
            setSelectedPeopleOld(selectedItem)

            const response1 = await api.get<IFinancial[]>('/Financeiro/ListarMovimentoPorParcelamento',
                {
                    params: {
                        installmentsId: Number(response.data.cod_Parcelamento),
                        page: currentPage + 1,
                        rows: 500,
                        token
                    }
                })


            const dadosFormatados = response1.data.map(item => {

                const forma = paymentFormList.find(
                    f => Number(f.paymentFormId) === Number(item.cod_FormaPagamento)
                );

                return {
                    ...item,
                    parcelaFormatada: `${item.num_Parcela}/${item.qtd_Parcelamento}`,
                    des_FormaPagamento: forma?.paymentFormDescription || '',
                    flg_Efetivado: item.flg_Efetivado === 'S' ? 'RECEBIDO' : 'PENDENTE'
                };
            });

            
            const totalMovimento = response1.data.reduce((total, item) => {
                return total + Number(item.vlr_Liquido || 0);
            }, 0);


           setInvoiceValue(
                totalMovimento.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })
            );
                        
            setMovementList(dadosFormatados);

            const primeiraParcela = dadosFormatados.find(
                item => Number(item.num_Parcela) === 1
            );

            if (primeiraParcela && !invoiceDescription ) {
                setDescription(primeiraParcela.des_Movimento);
            }


            setIsLoading(false);
        }
        catch (err: any) {
            setIsLoading(false)
            addToast({ type: "info", title: "Operação não realizada", description: err.response.data.Message })

        }
    }



    const LoadBillingInvoicing = async (movementId) => {
        try {
            setIsLoading(true);

            const response = await api.get('/Financeiro/Faturamento2/Editar', {
                params: {
                    instalmentId: Number(movementId),
                    token
                }
            });

            const data = response.data;

            if (data && Object.keys(data).length > 0) {

                setInvoiceId(data.invoiceId);
                setInvoiceNumber(data.invoiceNumber);
                

                const selectedItem: ISelectData = {
                    id: data.personId?.toString() || '',
                    label: data.personName || ''
                };

                setSelectedPeople(selectedItem);
                setDescription(data.invoiceDescription);

                const selectedItem1: ISelectData = {
                    value: data.billingRulerId?.toString() || '',
                    label: data.billingRulerName || ''
                };

                setSelectedBillingRuler(selectedItem1);

                setInvoiceDate(
                    format(new Date(data.issueDate), "yyyy-MM-dd")
                );

                setButtonFatura('Alterar Fatura');

            }

            setIsLoading(false);

            return data;
            
        } catch (err: any) {
            setIsLoading(false);
       
            addToast({
                type: "info",
                title: "Operação não realizada",
                description: err.response?.data?.Message
            });
        }
    };



    const ListBillingRuler = useCallback(async (term: string) => {
        try {
            const token = localStorage.getItem("@GoJur:token");

            const response = await api.get<IBillingRuler[]>("/Financeiro/ReguaCobranca/Listar", {
                params: {
                    page: 0,
                    rows: 50,
                    filterClause: term,
                    token,
                },
            });

            const options = response.data.map((item) => ({
                value: item.billingRulerId,
                label: item.descriptionBillingRuler,
            }));

            setBillingRulerList(options);

            return options;

        } catch (err) {
            //console.error(err);

            if (err.response.data.statusCode == 1002) {
                addToast({
                    type: 'info',
                    title: 'Permissão negada',
                    description: 'Seu usuário não tem permissão para acessar esse módulo, contate o administrador do sistema',
                });
                //signOut()
            }

        }
    }, []);


    const CustomHeaderCell = (props: any) => {
        const { column } = props;

        if (column.name === '') {
            return (
                <TableHeaderRow.Cell {...props}>
                    <input
                        type="checkbox"
                        checked={
                            movementList.length > 0 &&
                            selectedRows.length === movementList.length
                        }
                        onChange={handleSelectAll}
                    />
                </TableHeaderRow.Cell>
            );
        }

        return <TableHeaderRow.Cell {...props} />;
    };

    const CustomCell = (props) => {
        const { column } = props;

       
        if (column.title === '') {
            const rowId = props.row.parcelaFormatada;

            return (
                <Table.Cell {...props}>
                    <input
                        type="checkbox"
                        checked={selectedRows.includes(rowId)}
                        onChange={() => handleSelectRow(rowId)}
                    />
                </Table.Cell>
            );
        }


        if (column.title === 'Ações') {

            const rowFp = props.row.des_FormaPagamento;

            if (rowFp == 'BOLETO') {
                return (
                    <Table.Cell onClick={(e) => handleClick(props)} {...props}>
                        <button
                            className="buttonLinkClick"
                            type='button'
                        >
                          <FaBarcode title="Clique aqui para gerar boleto."/>
                        </button>

                    </Table.Cell>
                );

            }

        }



        if (column.title === 'Editar') {
            return (
                <Table.Cell onClick={(e) => handleClick(props)} {...props}>
                    <button
                        className="buttonLinkClick"
                        type='button'
                    >

                        <FiEdit title="Clique aqui para editar movimento."/>

                    </button>

                </Table.Cell>
            );

        }



        return <Table.Cell {...props} />;
    };



const tableColumnExtensions = useMemo(() => [
  { columnName: '', width: '5%' },
  { columnName: 'parcelaFormatada', width: '10%' },
  { columnName: 'dta_Movimento', width: '10%' },
  { columnName: 'vlr_Liquido', width: '10%' },
  { columnName: 'des_FormaPagamento', width: '15%' },
  { columnName: 'flg_Efetivado', width: '15%' },
  { columnName: 'des_Observacao', width: '25%' },

  ...(buttonFatura === 'Alterar Fatura'
    ? [{ columnName: 'acoes', width: '5%' }]
    : []),

  ...(buttonFatura === 'Alterar Fatura'
    ? [{ columnName: 'editar', width: '5%' }]
    : [])
], [buttonFatura]);


    const [dateColumns] = useState(['dateUpload']);
    const columns = [
        { name: 'cod_Movimento', title: 'Código' },
        { name: '', title: '' },
        { name: 'parcelaFormatada', title: 'Parcela' },
        { name: 'dta_Movimento', title: 'Vencimento' },
        { name: 'vlr_Liquido', title: 'Valor',
        getCellValue: row =>
            row.vlr_Liquido?.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }) },
        { name: 'des_FormaPagamento', title: 'Forma Pagto' },
        { name: 'flg_Efetivado', title: 'Status' },
        { name: 'des_Observacao', title: 'Observação' },

        ...(buttonFatura === 'Alterar Fatura'
            ? [{ name: 'acoes', title: 'Ações' }]
            : []),

        ...(buttonFatura === 'Alterar Fatura'
            ? [{ name: 'editar', title: 'Editar' }]
            : [])

    ];

    const [hiddenColumnNames, setHiddenColumnNames] = useState<string[]>([
        'cod_Movimento'
    ]);

    useEffect(() => {
        ListBillingRuler("")

    }, [])



    const PaymentFormList = useCallback(async () => {
        try {


            const response = await api.get<IPaymentFormData[]>("/FormaDePagamento/Listar", {
                params: {
                    page: 0,
                    rows: 200,
                    filterClause: '',
                    token,
                },
            });


            setPaymentFormList(response.data)


        } catch (err) {
            addToast({ type: "info", title: "Operação não realizada", description: err.response.data.Message })

        }

    }, []);


const Validate =() => {
    let isValid = true;

    // avoid click many times
    if (isSaving){
      return;
    }

    if ( (selectedPeople.id !== selectedPeopleOld.id) && showChangeCustomer === false )
    {
      setShowChangeCustomer(true)
      isValid = false;
    }
    else
      setShowChangeCustomer(false) 
 
    return isValid;
  }

    const handleSave = async () => {
        try {
          
            if (!Validate()) return;

            setIsLoading(true);

            const payload = {
                invoiceId: invoiceId || 0,
                companyId: companyId,
                invoiceNumber: invoiceNumber,
                personId: selectedPeople?.id,
                personName: selectedPeople?.label,
                personIdOld: selectedPeopleOld?.id,
                billingRulerId: selectedBillingRuler?.value ?? null,
                invoiceDescription: description,
                issueDate: invoiceDate,
                movementId: movementId,
                token: token,

                financialDTO: {
                    //editChild: selectedPeople?.id == selectedPeopleOld?.id ? 'justOne' : 'all',
                    editChild: 'none',
                    dta_Movimento: movementDate,
                    vlr_Movimento:movementValue,
                    cod_FormaPagamento: paymentFormId
                },

                billingIssuingInvoices: movementList.map(item => ({
                    invoiceMovimentId: item.cod_Fatura2Movimento || 0,
                    companyId: companyId,
                    invoiceId: invoiceId || 0,
                    movementID: Number(item.cod_Movimento),
                    descriptionObservation: item.des_Observacao || ''
                }))
            };

            const response = await api.post(
                "/Financeiro/Faturamento2/Salvar",
                payload
            );


            await LoadMovement(movementId)
            await LoadBillingInvoicing(movementId)


            addToast({
                type: "success",
                title: "Sucesso",
                description: "Faturamento salvo com sucesso"
            });

            setIsLoading(false);

        } catch (err: any) {
            setIsLoading(false);
    
            addToast({
                type: "error",
                title: "Operação não realizada",
                description: err.response?.data?.Message
            });
        }
    };


    const handleClick = useCallback(async (props: any) => {
        if (props.column.name === 'editar') {

            setBillingInvoicing(prev => ({
                ...prev,
                invoiceId: invoiceId || 0,
                companyId: companyId,
                invoiceNumber: invoiceNumber,
                personId: selectedPeople?.id,
                personName: selectedPeople?.label,
                personIdOld: selectedPeopleOld?.id,
                billingRulerId: selectedBillingRuler?.value ?? null,
                invoiceDescription: description,
                issueDate: invoiceDate,
                movementId: movementId,
                token: token
            }));
            
            const id = props.row.cod_Movimento;

            setMovementIdEdit(id);

            setShowPaymentModal(true)
        }


    }, [accountId, currentPage, pageSize, selectedPeople, selectedPeopleOld]);


    const ClosePaymentModal = async () => {
        //setInvoice('')
        setMovementType('')
        setShowPaymentModal(false)
        setIsLoading(false)
    }

    const LoadMovementsByPeriod = useCallback(async () => {

    }, [])


    const LoadTotalByPeriod = async () => {
    }

    const LoadMovementsByExtract = useCallback(async () => {
    }, [])


    const LoadTotalByExtract = async () => {

    };


    const handleMovementDate = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setInvoiceDate(event.target.value)
    }, []);


    const handleLogOnDisplay = useCallback(async () => {
        setShowLog(true);
    }, []);


    const handleCloseLog = () => {
        setShowLog(false)
    }


    
const handleDeleteInvoice = useCallback(async (invoiceId: number, confirmDelete: boolean) => {
    try{

        if (confirmDelete == false) {
            //setCurrentWorkflowId(workflowId)
            setConfirmDeleteModal(true)
            return;
        }

        
        await api.delete('Financeiro/Faturamento2/Deletar', {
        params: {
            id: invoiceId,
            token
        }
        })

        addToast({
        type: "success",
        title: "Fatura",
        description: "A fatura foi deletada"
        })

        
        handleStateType('Inactive')
        history.push('/financeiro')

        setConfirmDeleteModal(false)

    }
    catch (err: any) {

    }

  }, [addToast, history]);



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

                        <section id='FirstElements'>

                            <label htmlFor="valor">
                                Cliente
                                    
                                    <Select
                                    isClearable
                                    isSearchable
                                    placeholder="Selecione"
                                    options={customerList}
                                    value={selectedPeople}
                                    name="cliente"
                                    styles={selectStyles}

                                    onChange={(selected) => {
                                        setSelectedPeople(selected);
                                    }}

                                    onInputChange={(inputValue, { action }) => {

                                        if (action === "input-change" && inputValue.length >= 2) {
                                        ListCustomerPersonData(inputValue).then((data) => {
                                            setCustomerList(data);
                                        });
                                        }

                                        return inputValue;
                                    }}
                                    />

                            </label>

                            <label htmlFor='Data'>
                                <DatePicker
                                    title="Emissão"
                                    onChange={handleMovementDate}
                                    value={invoiceDate}
                                    
                                />
                            </label>


                        </section>

                        <section id='SecondElements'>
                            <label htmlFor="valor">
                                Descrição
                                <input
                                    type="text"
                                    className='inputField'
                                    maxLength={200}
                                    value={description}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                                />
                            </label>

                            <label>
                                Régua de Cobrança
                                <Select
                                    isClearable
                                    isSearchable
                                    id="workflow"
                                    options={billingRulerList}
                                    placeholder="Selecione"
                                    value={selectedBillingRuler}
                                    onChange={(selectedOption) => {
                                        if (selectedOption) {
                                            setSelectedBillingRuler(selectedOption);
                                        } else {
                                            setSelectedBillingRuler(null);
                                        }
                                    }}
                                    onInputChange={(inputValue, { action }) => {
                                        if (action === "input-change") {
                                            ListBillingRuler(inputValue);
                                        }
                                    }}
                                    filterOption={(option, inputValue) =>
                                        option.label.toLowerCase().includes(inputValue.toLowerCase())
                                    }
                                    classNamePrefix="rs"
                                    styles={selectStyles}
                                />

                            </label>

                        </section>

                    </div>


                    <div style={{ float: 'left', width: '30%', marginLeft: '5%' }}>
                        <br />
                        <div className="mini-invoice">
                            <div className="mini-top">
                                <span className="mini-number">Fat. {invoiceNumber?.toString().padStart(6, '0')}</span>
                                <span className="mini-status aberta">ABERTA</span>
                            </div>
                            {/*
                            <div className="mini-installment">
                                Parcela {movementParcelas}
                            </div>
                                */}
                            <div className="mini-value">
                                R$ {invoiceValue}

                            </div>
                        </div>

                    </div>

                </div>

                <br />

                <GridSubContainer style={{ pointerEvents: (isDeletingFile ? 'none' : 'all') }}>
                    <Grid
                        rows={movementList}
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

                        <DateTypeProvider for={dateColumns} />
                        <Table
                            cellComponent={CustomCell}
                            columnExtensions={tableColumnExtensions}
                            messages={languageGridEmpty}
                        />
                        <TableHeaderRow cellComponent={CustomHeaderCell} />
 
                        <TableColumnVisibility
                            hiddenColumnNames={hiddenColumnNames}
                            onHiddenColumnNamesChange={setHiddenColumnNames}
                        />
                        <PagingPanel
                            messages={languageGridPagination}
                        />
                    </Grid>

                </GridSubContainer>


                <br />

                <div id='Buttons'>
                    <div className='log'>
                        {movementId != "0" && (
                            <button type="button" id="log" onClick={handleLogOnDisplay}>
                                <div style={{ float: 'left' }}><IoIosPaper title="Ver Historico" /></div>
                                <div style={{ float: 'left' }}>&nbsp;Ver Histórico</div>
                            </button>
                        )}
                    </div>

                    <div style={{ float: 'right' }}>
                        <button
                            className="buttonClick"
                            type='button'
                            onClick={() => handleSave()}
                        >
                            <BiSave />
                            {buttonFatura}
                        </button>


                        {(!isMOBILE && movementId != '0' && invoice == 0) && (
                            <button
                                className="buttonClick"
                                type='button'
                                onClick={() => GenerateDocument()}
                            >
                                <CgFileDocument />
                                Emitir Fatura
                            </button>
                        )}

                        {(movementId != '0' && invoice == 0) && (
                            <button
                                className="buttonClick"
                                type='button'
                                onClick={() => CheckDeleteType(paymentQtd)}
                            >
                                <RiMailSendLine />
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

                        <button
                            type='button'
                            className="buttonClick"
                            onClick={() => { handleStateType('Inactive'); history.push(`/financeiro`) }}
                        >
                            <FaRegTimesCircle />
                            Fechar
                        </button>
                        
                        {isOpen && (
                            <div className="dropdownMenu">
                                <button className="dropdownItem">Gerar Boletos Selecionados</button>
                                <button className="dropdownItem"><FiTrash /> Excluir Todos os Boletos</button>
                                <button className="dropdownItem" onClick={() => handleDeleteInvoice(invoiceId, false)}> <FiTrash /> Excluir Fatura</button>
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
            {(showPaymentModal) && <FinancialInvoicingModal callbackFunction={{ movementId, movementIdEdit, invoiceId, billingInvoicing, visualizeType, movementList, ClosePaymentModal, LoadMovement, LoadBillingInvoicing }} />}

          
            {showChangeCustomer && (
                <ConfirmBoxModal
                    title="Alterar cliente da fatura"
                    caller="changeDefaultHeade1"
                    useCheckBoxConfirm
                    message="Você esta alterando o cliente através da fatura, todos os movimentos serão alterados"
                />
            )}

            {confirmDeleteModal && (
                <ConfirmBoxModal
                title="Excluir Registro"
                caller="invoiceDelete"
                message="Confirma a exclusão desta fatura ?"
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

        
          {showLog && (
                <LogModal
                  idRecord={Number(invoiceNumber)}
                  handleCloseModalLog={handleCloseLog}
                  logType="invoicingLog"
                />
              )}



        </Container>
    );
};

export default BillingInvoicing;
