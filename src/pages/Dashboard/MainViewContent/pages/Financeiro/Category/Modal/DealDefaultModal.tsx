/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-one-expression-per-line */

import React, { useCallback, useEffect, useState } from 'react'
import Modal from 'react-modal';
import api from 'services/api';
import Select from 'react-select';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useToast } from 'context/toast';
import { BiSave } from 'react-icons/bi';
import { useConfirmBox } from 'context/confirmBox';
import { FiX } from 'react-icons/fi';
import { FaTools, FaRegTimesCircle, FaCheck, FaFileContract }from 'react-icons/fa';
import { AiOutlinePrinter, AiOutlineEnter } from 'react-icons/ai';
import { useDevice } from "react-use-device";
import { selectStyles, useDelay, currencyConfig, FormatDate } from 'Shared/utils/commonFunctions';
import { useMenuHamburguer } from 'context/menuHamburguer'
import { envProvider } from 'services/hooks/useEnv';
import { IDefaultsProps } from 'pages/Printers/Interfaces/Common/ICommon';
import { useSecurity } from 'context/securityContext';
import { SecurityModule } from 'context/Interfaces/ISecurity';
import { Container, OverlaySave } from './styles';

export interface ISelectData{
  id: string;
  label: string;
};

export default function DealDefaultModal () {
  const { isOpenMenuDealDefaultCategory, handleIsOpenMenuDealDefaultCategory } = useMenuHamburguer();
  const { addToast } = useToast();
  const { handleCancelMessage, handleCaller } = useConfirmBox();
  const token = localStorage.getItem('@GoJur:token');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categoryList, setCategoryList] = useState<ISelectData[]>([]);
  const [categoryId1, setCategoryId1] = useState('');
  const [categoryDescription1, setCategoryDescription1] = useState('');
  const [categoryTerm1, setCategoryTerm1] = useState('');
  const [categoryId2, setCategoryId2] = useState('');
  const [categoryDescription2, setCategoryDescription2] = useState('');
  const [categoryTerm2, setCategoryTerm2] = useState('');
  const [categoryId3, setCategoryId3] = useState('');
  const [categoryDescription3, setCategoryDescription3] = useState('');
  const [categoryTerm3, setCategoryTerm3] = useState('');


  useEffect(() => {
    LoadDefaultCategory();
    LoadCategory();
  }, [])

  
  useDelay(() => {
    if (categoryTerm1.length && !isLoading)
      LoadCategory('', '1')
    if (categoryTerm2.length && !isLoading)
      LoadCategory('', '2')
    if (categoryTerm3.length && !isLoading)
      LoadCategory('', '3')
  }, [categoryTerm1, categoryTerm2, categoryTerm3], 750);


  const LoadDefaultCategory = async () => {
    try
    {
      const response = await api.get('/Categoria/ListarPadraoAcordo', {
        params:{ token }
      });

      response.data.map((item) => {
        if (item.label == "VE")
        {
          setCategoryId1(item.categoryId);
          setCategoryDescription1(item.categoryDescription);
        }
        if (item.label == "RC")
        {
          setCategoryId2(item.categoryId);
          setCategoryDescription2(item.categoryDescription);
        }
        if (item.label == "PC")
        {
          setCategoryId3(item.categoryId);
          setCategoryDescription3(item.categoryDescription);
        }
        return;
      });

      setIsLoading(false);
    } catch (err:any) {
      setIsLoading(false);
    }
  };


  const LoadCategory =  async (stateValue?: string, caller?: string) => {
    let filter = '';

    if(caller == "1")
      filter = categoryTerm1;
    if(caller == "2")
      filter = categoryTerm2;
    if(caller == "3")
      filter = categoryTerm3;

    if (stateValue == 'reset')
      filter = '';

    try {
      const response = await api.get<ISelectData[]>('/Categoria/ListarPorDescrição', {
        params:{
          rows: 50,
          filterClause: filter,
          token
        }
      })

      setCategoryList(response.data)
    } catch (err:any) {
      addToast({ type: "info", title: "Operação não realizada", description: err.response.data });
    }
  };


  const handleCategorySelected1 = (item) => {
    if (item){
      setCategoryId1(item.id);
      setCategoryDescription1(item.label);
    }else{
      setCategoryId1('');
      setCategoryDescription1('');
      LoadCategory('reset');
    }
  };


  const handleCategorySelected2 = (item) => {
    if (item){
      setCategoryId2(item.id);
      setCategoryDescription2(item.label);
    }else{
      setCategoryId2('');
      setCategoryDescription2('');
      LoadCategory('reset');
    }
  };


  const handleCategorySelected3 = (item) => {
    if (item){
      setCategoryId3(item.id);
      setCategoryDescription3(item.label);
    }else{
      setCategoryId3('');
      setCategoryDescription3('');
      LoadCategory('reset');
    }
  };


  const handleCloseModal = () => {
    handleIsOpenMenuDealDefaultCategory(false)
    handleCaller('dealDefaultCategory')
  }


  const Save = useCallback(async() => {
    try {
      setIsSaving(true);

      if(categoryId1 != '')
      {
        if(categoryId2 != '')
        {
          if(categoryId1 == categoryId2)
          {
            setIsSaving(false);
            addToast({ type: "info", title: "AVISO", description: "Não pode ter categorias repetidas" });
            return;  
          }
        }
        if(categoryId3 != '')
        {
          if(categoryId1 == categoryId3)
          {
            setIsSaving(false);
            addToast({ type: "info", title: "AVISO", description: "Não pode ter categorias repetidas" });
            return;  
          }
        }
      }
      if(categoryId2 != '')
      {
        if(categoryId3 != '')
        {
          if(categoryId2 == categoryId3)
          {
            setIsSaving(false);
            addToast({ type: "info", title: "AVISO", description: "Não pode ter categorias repetidas" });
            return;
          }
        }
      }

      const response = await api.post('/Categoria/SalvarPadraoAcordo', {
        categoryDealVEId: categoryId1,
        categoryDealRCId: categoryId2,
        categoryDealPCId: categoryId3,
        token
      })

      handleCloseModal();
      setIsSaving(false);
      addToast({ type: "success", title: "Operação realizada com sucesso", description: "Categoria do acordo salvo" });
    } catch (err:any) {
      setIsSaving(false);
      addToast({ type: "info", title: "Falha ao salvar categorias do acordo.", description: err.response.data.Message });
    }

  }, [ categoryId1, categoryId2, categoryId3]);


  return(
    <>
      <Modal
        isOpen
        overlayClassName="react-modal-overlay2"
        className="react-modal-content-DealDefaultCategory"
      >
        <Container id='Container'>
          <header>
            <h1>Categoria Padrão do Acordo</h1>
          </header>

          <div id='Categoria1' className='categoria'>
            <label style={{width:'100%'}}>
              Categoria receita de acordo - neste campo selecione a categoria que deseja atribuir a receita ref. ao acordo cujo valor pertence ao escritório.
              <br />Exemplo (Honorários)
              <div style={{width:'50%', marginLeft:'25%', marginTop:'10px'}}>
                <Select
                  isSearchable
                  value={{ id: categoryId1, label: categoryDescription1 }}
                  onChange={handleCategorySelected1}
                  onInputChange={(term) => setCategoryTerm1(term)}
                  isClearable
                  placeholder=""
                  styles={selectStyles}
                  options={categoryList}
                  required
                />
              </div>
            </label>
          </div>
          <br /><br />

          <div id='Categoria2' className='categoria'>
            <label style={{width:'100%'}}>
              Categoria crédito transitório - neste campo selecione a categoria que deseja atribuir a receita do acordo cujo valor será repassado ao cliente. Este valor não pertence ao escritório e fica em posse durante um período temporário até o repasse.
              <br />Exemplo (Crédito Transitório Acordo)
              <div style={{width:'50%', marginLeft:'25%', marginTop:'10px'}}>
                <Select
                  isSearchable
                  value={{ id: categoryId2, label: categoryDescription2 }}
                  onChange={handleCategorySelected2}
                  onInputChange={(term) => setCategoryTerm2(term)}
                  isClearable
                  placeholder=""
                  styles={selectStyles}
                  options={categoryList}
                  required
                />
              </div>
            </label>
          </div>
          <br /><br />

          <div id='Categoria3' className='categoria'>
            <label style={{width:'100%'}}>
              Categoria pagto do acordo - neste campo selecione a categoria que deseja atribuir para a despesa a que efetiva o pagamento do acordo ao cliente.
              <br />Exemplo (Repasse Acordo ao Cliente)
              <div style={{width:'50%', marginLeft:'25%', marginTop:'10px'}}>
                <Select
                  isSearchable
                  value={{ id: categoryId3, label: categoryDescription3 }}
                  onChange={handleCategorySelected3}
                  onInputChange={(term) => setCategoryTerm3(term)}
                  isClearable
                  placeholder=""
                  styles={selectStyles}
                  options={categoryList}
                  required
                />
              </div>
            </label>
          </div>
          <br />

          <footer>
            <button 
              className="buttonClick" 
              type="button"
              onClick={()=> Save()}
              title="Clique para salvar o parâmetro"
            >
              <BiSave />
              {isSaving && <span>Salvando...</span> }
              {!isSaving && <span>Salvar</span>}
            </button>   

            <button 
              className="buttonClick" 
              type="button"
              onClick={handleCloseModal}
              title="Clique para retornar a listagem de processos"
            >
              <FaRegTimesCircle />
              <span>Fechar</span> 
            </button>  
          </footer>
        </Container>
      </Modal>

      {isSaving && (
        <>
          <OverlaySave />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            Salvando...
          </div>
        </>
      )}
    </>
  )
}    