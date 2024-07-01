/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useState, ChangeEvent, useEffect } from 'react';
import { FaFileAlt, FaRegTimesCircle } from 'react-icons/fa';
import { AutoCompleteSelect, GridSubContainer } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { FiDownloadCloud } from 'react-icons/fi';
import { IoReload } from 'react-icons/io5';
import { Grid, Table, TableHeaderRow, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import { PagingState, CustomPaging } from '@devexpress/dx-react-grid';
import { languageGridEmpty, languageGridPagination, languageGridLoading } from 'Shared/utils/commonConfig';
import Select from 'react-select'
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { selectStyles, useDelay, FormatDate } from 'Shared/utils/commonFunctions';
import { useToast } from 'context/toast';
import { useMenuHamburguer } from 'context/menuHamburguer'
import api from 'services/api';
import { IAutoCompleteData, ISelectData, IPaymentSlipContractData, IShippingFileData } from '../../../Interfaces/IBIllingContract'
import { ModalShippingFile, OverlayModal, OverlayModal2 } from './styles';

const ShippingFileModal = () => {
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const { isMenuOpen, handleIsMenuOpen, caller, isOpenMenuConfig, handleCaller, handleIsOpenMenuConfig } = useMenuHamburguer();
  const [openModalShippingFile, setOpenModalShippingFile]= useState<boolean>(false)
  const [isLoading, setIsLoading]= useState<boolean>(false);

  const [paymentSlipContract, setPaymentSlipContract] = useState<IAutoCompleteData[]>([]);
  const [paymentSlipContractId, setPaymentSlipContractId] = useState<string>("")
  const [paymentSlipContractValue, setPaymentSlipContractValue] = useState('');
  const [paymentSlipContractTerm, setPaymentSlipContractTerm] = useState('');

  const [shippingFileList, setShippingFileList] = useState<IShippingFileData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizes] = useState([10, 20, 30, 50]);

  useEffect(() => {
   
    if (caller == "shippingFileModal" && isOpenMenuConfig)
    {     
      setOpenModalShippingFile(true)
    }
  },[caller, isMenuOpen])

  useEffect(() => {
    if(openModalShippingFile == true){
      LoadPaymentSlipContract();
      LoadShippingFile();
      LoadDefaultPaymentSlip()
    }
  },[openModalShippingFile])

  useEffect(() => {
    if(openModalShippingFile == true){
      LoadShippingFile();
    }

  },[paymentSlipContractId, currentPage])

  useDelay(() => {
    if (paymentSlipContractTerm.length > 0){

      LoadPaymentSlipContract()
    }
  }, [paymentSlipContractTerm], 700)


  const columnsCustomerList = [
    { name: 'fileName',                       title: 'Remessas' },
    { name: 'download',                       title: 'Download' },

  ];

  const [tableColumnExtensionsCustomerList] = useState([
    { columnName: 'fileName',                 width: '80%' },
    { columnName: 'download',                 width: '20%' },
  ]);


  const LoadPaymentSlipContract = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? paymentSlipContractValue:paymentSlipContractTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.get<IPaymentSlipContractData[]>('/CarteiraDeCobrança/Listar', {
          params:{page: 0, rows: 20, filterClause: filter, token}
      });

      const listPaymentSlipContract: ISelectData[] = []

      response.data.map(item => {
        return listPaymentSlipContract.push({
          id: item.paymentSlipContractId,
          label: item.paymentSlipContractDescription,
        })
      })

      setPaymentSlipContract(listPaymentSlipContract)
      setIsLoadingComboData(false)     

    } catch (err) {
      console.log(err);
    }
  }

  const DownloadFile = async (fileName: string) => {

    try {
      const response =  api.post('/Financeiro/Faturamento/BaixarArquivoRemessa',{
        fileName,
        token,      
      });
  
      window.open((await response).data, '_blank')

    } catch (err) {
      console.log(err);
    }
  }

  const GenerateShippingFile = useCallback(async () => {

    setIsLoading(true)

    try {
      const response = await api.get<IShippingFileData>('/Financeiro/Faturamento/GerarRemessaBoletos', {
        params:{
          paymentSlipContractId,
          token,
        }
      });  
      
      addToast({
        type: "success",
        title: "Banco Remessa / Retorno",
        description: "A remessa foi gerada com sucesso."
      })

      LoadShippingFile()
      setIsLoading(false)
          
    } catch (err: any) {
      setIsLoading(false)
      addToast({
        type: "error",
        title: "Falha ao gerar remessa.",
        description:  err.response.data.Message
      })
    }

  },[isLoading, paymentSlipContractId])
  

  const LoadDefaultPaymentSlip = useCallback(async () => {

    setIsLoading(true)

    try {
      const response = await api.get<IPaymentSlipContractData>('/CarteiraDeCobrança/ObterPadrao', {
        params:{
          token,
        }
      });  
      
        setPaymentSlipContractId(response.data.paymentSlipContractId)
        setPaymentSlipContractTerm(response.data.paymentSlipContractDescription)
        setIsLoading(false)
          
    } catch (err) {
      setIsLoading(false)
      console.log(err);
    }

  },[isLoading, paymentSlipContractId, paymentSlipContractTerm])


  const LoadShippingFile = useCallback(async(state = '') => {

    setIsLoading(true)
    try {

      const page = currentPage + 1

      const response = await api.get<IShippingFileData[]>('/Financeiro/Faturamento/ListarRemessas', {
        params:{
        page,
        rows: pageSize,
        filterClause: paymentSlipContractId,    
        token,
        }
      });
      
      setShippingFileList(response.data)
      if (response.data.length > 0)
        setTotalRows(response.data[0].count)
      setIsLoading(false)

    } catch (err) {
      setIsLoading(false)
      console.log(err);
    }

  },[paymentSlipContractId, pageSize, currentPage, totalRows]);


  const CustomCellCustomerList = (props) => {

    const { column } = props;

    if (column.name === 'fileName') {
      return (
        <Table.Cell {...props}>

          <span style={{color:'black', fontSize:'0.75rem', fontFamily:'Arial', fontWeight:600,}}>Data:&nbsp;</span>
          <span style={{color:'black', fontSize:'0.75rem', fontFamily:'Arial'}}>{(FormatDate(new Date(props.row.dta_Remessa), 'dd/MM/yyyy HH:mm'))}</span>
          <br />
          <br />
          <span style={{color:'black', fontSize:'0.75rem', fontFamily:'Arial', fontWeight:600,}}>Carteira:&nbsp;</span>
          <span style={{color:'black', fontSize:'0.75rem', fontFamily:'Arial'}}>{props.row.des_CarteiraCobranca}</span>

        </Table.Cell>
      );
    }

    if (column.name === 'download') {
      return (
        <Table.Cell onClick={(e) => handleClickDownload(props)} {...props}>
           &nbsp;&nbsp;
          <FiDownloadCloud title="Clique para fazer o download deste documento" />

        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  };

  const handlePaymentSlipContractSelected = (item) => { 
      
    if (item){
      setPaymentSlipContractValue(item.label)
      setPaymentSlipContractId(item.id)
      setTotalRows(0)
      setIsLoading(true)
      
    }else{
      setPaymentSlipContractValue('')
      LoadPaymentSlipContract('reset')
      setPaymentSlipContractId('')
    }
  }

  const handleShippingFileModalClose = () => { 
    setOpenModalShippingFile(false)
    handleCaller("")
    handleIsMenuOpen(false)
    handleIsOpenMenuConfig(false)
    setPaymentSlipContractId("")
    setShippingFileList([])
  }

  const handleCurrentPageCustomerList = (value) => {
    setCurrentPage(value)
  }

  const handlePageSizeCustomerList = (value) => {
    setPageSize(value)

  }

  const handleClickDownload = (item) => {
    DownloadFile(item.row.fileName)
  }

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      handleUpload(file)
    }
  }; 

  async function handleUpload(document: any) {

    setIsLoading(true)
    if(document === null) return;

    try {


    const tokenApi = localStorage.getItem('@GoJur:token');

    const payload = {
        token: tokenApi,
        referenceId: paymentSlipContractId,
      }

      const file = new File([document], `slip.txt`)

      const documentFile = new FormData()
        
      documentFile.append('document', file)
      documentFile.append('payload',  JSON.stringify(payload))  
      
      await api.post('/Financeiro/Faturamento/RetornoRemessa', documentFile)


        addToast({
          title: "Faturamentos - Faturas",
          type:"success",
          description: "Arquivo de retorno processado e baixas realizadas."
        })

        handleShippingFileModalClose()
        setIsLoading(false)
        
      } catch (err: any) {
        setIsLoading(false)
        addToast({
          title: "Operação não Realizada",
          type:"error",
          description:  err.response.data.Message
        })          
      }
}

  return (
    <>
      {openModalShippingFile && (
        <>
          <OverlayModal2 />
        </>
    )} 
      {isLoading && (
        <>
          <OverlayModal />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Carregando ...
          </div>
        </>
    )} 
       
      <ModalShippingFile show={openModalShippingFile}>

        <div className='header'>
          <p className='headerLabel'>Banco Remessa / Retorno</p>
        </div>

        
        <div style={{display:"flex"}}>
          <div style={{width:"50%"}}>
            <AutoCompleteSelect>
              <p>Carteira Cobranca:</p>
              <Select
                isSearchable
                isClearable
                placeholder="Selecione"
                value={paymentSlipContract.filter(item => item.id == paymentSlipContractId)}
                onChange={(item) => handlePaymentSlipContractSelected(item)}
                onInputChange={(term) => setPaymentSlipContractTerm(term)}
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}
                options={paymentSlipContract}
              />
            </AutoCompleteSelect>
          </div>      

          <div style={{marginLeft:"15%", marginTop:"33px", marginBottom:"auto"}}>
            <label
              htmlFor='teste'
              className="buttonLinkClick"
              title="Clique para selecionar arquivos em seu computador"
            >
              <FaFileAlt />
              Baixar Retorno
              <input
                id='teste'
                type="file"
                style={{display: 'none'}}
                onChange={onFileChange}
              />
            </label>
          </div>    
        </div>

        <div className='border'>&nbsp;</div>

        <div className='mainDiv'>

        
          <div>
            <GridSubContainer>
              <Grid
                rows={shippingFileList}
                columns={columnsCustomerList}
              >
                <PagingState
                  currentPage={currentPage}
                  pageSize={pageSize}
                  onCurrentPageChange={(e) => handleCurrentPageCustomerList(e)}
                  onPageSizeChange={(e) => handlePageSizeCustomerList(e)}
                />
                <CustomPaging totalCount={totalRows} />
                <Table
                  cellComponent={CustomCellCustomerList}
                  columnExtensions={tableColumnExtensionsCustomerList}
                  messages={isLoading? languageGridLoading: languageGridEmpty}
                />
                <TableHeaderRow />
                <PagingPanel
                  messages={languageGridPagination}
                />
              </Grid>
            </GridSubContainer>
          </div>

        </div>
      
        <div className='footer'>
          <div style={{float:'right', marginRight:'20px', marginTop:"15px"}}>
            <div style={{float:'left'}}>
              <button 
                className="buttonClick"
                type='button'
                onClick={()=> GenerateShippingFile()}
                style={{width:'140px'}}
              >
                <IoReload />
                Gerar Remessa
              </button>
            </div>

            <div style={{float:'left', width:'100px'}}>
              <button 
                type='button'
                className="buttonClick"
                onClick={() => handleShippingFileModalClose()}
                style={{width:'90px'}}
              >
                <FaRegTimesCircle />
                Fechar
              </button>
            </div>
          </div>
        </div>

      </ModalShippingFile>

    </>
    
  )
  
}
export default ShippingFileModal;
