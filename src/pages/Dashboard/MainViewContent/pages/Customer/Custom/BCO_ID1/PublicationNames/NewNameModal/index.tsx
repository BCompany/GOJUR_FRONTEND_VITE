/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useState, ChangeEvent, useEffect } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { useToast } from 'context/toast';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { FiSave } from 'react-icons/fi';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { AiOutlineDelete } from 'react-icons/ai';
import api from 'services/api';
import { IAutoCompleteData, IPublicationNamesData } from '../../../../../Interfaces/IPublicationNames';
import { ModalNewName, ItemList } from './styles';

const NewNameModal = (props) => {
  const { addToast } = useToast();
  const { CloseNewNameModal, CloseNewNameModalAfterSave, setEditCaller, companyId, publicationNameId, editCaller } = props.callbackFunction
  const [isLoading, setIsLoading]= useState<boolean>(false);
  const [isSaving, setIsSaving]= useState<boolean>(false);
  const [isDelete, setIsDelete]= useState<boolean>(false);
  const token = localStorage.getItem('@GoJur:token');
  const [des_UfOab, setDes_UfOab] = useState<string>("00")
  const [publicationName, setPublicationName] = useState<string>("")
  const [oabNumber, setOabNumber] = useState<string>("")
  const [flg_Cortesia, setFlg_Cortesia] = useState<string>("N")

  const [coverage, setCoverage] = useState<string>("00")
  const [coverageList, setCoverageList] = useState<IAutoCompleteData[]>([]);
  const [coverageListData, setCoverageListData] = useState<IAutoCompleteData[]>([]);
  
  const [variation, setVariation] = useState<string>("")
  const [variationListIds, setVariationListIds] = useState<IAutoCompleteData[]>([])
  const [variationList, setVariationList] = useState<IAutoCompleteData[]>([])

  const [exclusion, setExclusion] = useState<string>("")
  const [exclusionListIds, setExclusionListIds] = useState<IAutoCompleteData[]>([])
  const [exclusionList, setExclusionList] = useState<IAutoCompleteData[]>([])

  const [cod_PublicacaoNomeParceiroPublicacao, setCod_PublicacaoNomeParceiroPublicacao] = useState<string>("")
  const [dta_courtesyStart, setDta_CourtesyStart] = useState<string>("")
  
  useEffect(() => {

    if (editCaller == "editNewName"){

      GetPublicationName()
    }
  
  },[]);

  const GetPublicationName = useCallback(async() => {
    try {

    setIsLoading(true)

    const response = await api.get<IPublicationNamesData>('/PublicacaoNomes/EditarPublicacao', {
      params:{
        companyId,
        cod_PublicacaoNome: publicationNameId,
        token,
      } 
    })

    setPublicationName(response.data.nom_Pesquisa)
    setOabNumber(response.data.num_OAB)
    setDes_UfOab(response.data.des_UfOab)
    setFlg_Cortesia(response.data.flg_Cortesia)
    setCod_PublicacaoNomeParceiroPublicacao(response.data.cod_PublicacaoNomeParceiroPublicacao)
    setDta_CourtesyStart(response.data.dta_CortesiaInicio)

    setIsLoading(false)


    if (response.data.abrangenciaStrList != null){
      const newData: IAutoCompleteData[] = []
        response.data.abrangenciaStrList.map(item => {
          return newData.push({
            id: item,
            label: item
          })
        })
        setCoverageList(newData)
        setCoverageListData(newData)
    }

    if (response.data.variationStrList != null){
      const newDataVariation: any[] = []
        response.data.variationStrList.map(item => {
          return newDataVariation.push({
            id: item,
            label: item
          })
        })
        setVariationList(newDataVariation)
        setVariationListIds(newDataVariation)
    }

    if (response.data.exclusionStrList != null){
      const newDataExclusion: any[] = []
        response.data.exclusionStrList.map(item => {
          return newDataExclusion.push({
            id: item,
            label: item
          })
        })
        setExclusionList(newDataExclusion)
        setExclusionListIds(newDataExclusion)
    }

    setEditCaller("")

  } catch (err) {
    setIsLoading(false)

  }

  },[isLoading, publicationName, oabNumber, des_UfOab, flg_Cortesia, cod_PublicacaoNomeParceiroPublicacao, dta_courtesyStart]);


  const saveNewName = useCallback(async() => {
    try {
      
      if(publicationName == ""){
        addToast({
          type: "info",
          title: "Operação Não Realizada",
          description: "O campo Nome deve ser preenchido."
        })

        return
      }

      if(oabNumber == ""){
        addToast({
          type: "info",
          title: "Operação Não Realizada",
          description: "O Campo OAB deve ser preenchido."
        })

        return
      }

      if(des_UfOab == "00"){
        addToast({
          type: "info",
          title: "Operação Não Realizada",
          description: "O campo UF da OAB deve ser preenchido."
        })

        return
      }
      setIsSaving(true)
      
      let variationListItens = '';
      let exclusionListItens = '';
      let coverageListItens = '';

      coverageListData.map((coverage) => {
        return coverageListItens += `${coverage.label},`
      })

      if(coverageListItens.includes(coverage)){
        addToast({
          type: "info",
          title: "Operação Não Realizada",
          description: "Não é possível adicionar abrangências repetidas na lista."
        })
        setIsSaving(false)
        return;
      }

      if(coverage != "00"){
        coverageListItens += coverage + ","; // eslint-disable-line prefer-template
      } 

        exclusionListIds.map((exclusion) => {
          return exclusionListItens += `${exclusion.label},`
        })

        variationListIds.map((variation) => {
          return variationListItens += `${variation.label},`
        })
             
      const token = localStorage.getItem('@GoJur:token');
      await api.post('/PublicacaoNomes/Salvar', {
        cod_Empresa: companyId,
        cod_PublicacaoNome: publicationNameId,
        dta_Cortesia: dta_courtesyStart,
        des_UfOab,
        des_UfAbrangencia: coverage,
        des_UfAbrangenciaString: coverageListItens,
        flg_Cortesia,
        nom_Pesquisa: publicationName,
        nom_ExclusaoStrList: exclusionListItens,
        nom_VariacaoStrList: variationListItens,
        num_OAB: oabNumber,
        cod_PublicacaoNomeParceiroPublicacao,
        token
      })
      
      addToast({
        type: "success",
        title: "Nome de Publicação",
        description: "O nome de publicação foi salvo no sistema.",
      })
   
      CloseNewNameModalAfterSave()
      setIsSaving(false)

    } catch (err:any) {
      setIsSaving(false)
      addToast({
        type: "error",
        title: "Falha ao salvar nome de publicação.",
        description: err.response.data.Message
      })
    }
  },[isSaving,dta_courtesyStart, des_UfOab, flg_Cortesia, publicationName, oabNumber, cod_PublicacaoNomeParceiroPublicacao, coverage, coverageList, exclusionListIds, exclusionList, variationListIds, variationList, coverageListData]);


  // DELETE
  const deleteNewName = async() => {
   
    try {
      setIsDelete(true)
      const token = localStorage.getItem('@GoJur:token');
      
      await api.delete('/PublicacaoNomes/Deletar', {
        params:{
        cod_PublicacaoNome: publicationNameId,
        companyId,
        token
        }
      })
      
      addToast({
        type: "success",
        title: "Nome de Publicação Excluído",
        description: "O nome da publicação foi excluído no sistema."
      })

      CloseNewNameModalAfterSave()
      setIsDelete(false)

    } catch (err:any) {
      setIsDelete(false)
      console.log(err)

      addToast({
        type: "error",
        title: "Falha ao excluir nome da publicação.",
        description: err.response.data.Message
      })
    }
  };


  // Add itens in List to show in screen
  const handleListItemExclusion = (event) => {

    if (event.charCode == 13){

      if(event.target.value == ""){
        return
      }

      const exclusionOjbect = {
        label:event.target.value += "#ID00", // eslint-disable-line no-param-reassign
        id: event.target.value
      }
  
      if(event.target.value == ""){
        return
      }
  
      setExclusionList(previousValues => [...previousValues, exclusionOjbect]) 
      setExclusionListIds(previousValues => [...previousValues, exclusionOjbect]) 
      setExclusion("")
     
    }
  }
  
// Remove itens from list of exclusion, and add flg_Ativo=N to label 
  const handleRemoveItemExclusion = (exclusion) => {
  
    const exclusionListUpdate = exclusionList.filter(item => item.label != exclusion.label);
    const exclusionListIdsUpdate = exclusionListIds.filter(item => item.label != exclusion.label);

    setExclusionList(exclusionListUpdate)
    setExclusionListIds(exclusionListIdsUpdate)

    const adjustObject = {
      label: exclusion.label += "#flg_Ativo=N", // eslint-disable-line no-param-reassign
      id: exclusion.label
    }

    setExclusionListIds(previousValues => [...previousValues, adjustObject])
  }


// Add itens in List to show in screen
  const handleListItemVariation = (event) => {

    if (event.charCode == 13){

      if(event.target.value == ""){
        return
      }

      const variationOjbect = {
        label:event.target.value += "#ID00", // eslint-disable-line no-param-reassign
        id: event.target.value
      }
  
      if(event.target.value == ""){
        return
      }
 
      setVariationList(previousValues => [...previousValues, variationOjbect])
      setVariationListIds(previousValues => [...previousValues, variationOjbect])
      setVariation("")    
    }
  }
  
  // Remove itens from list of variation, and add flg_Ativo=N to label 
  const handleRemoveItemVariation = (variation) => {
  
    const variationListUpdate = variationList.filter(item => item.label != variation.label);
    const variationListIdsUpdate = variationListIds.filter(item => item.label != variation.label);
    
    setVariationList(variationListUpdate)
    setVariationListIds(variationListIdsUpdate)

    const adjustObject = {
      label: variation.label += "#flg_Ativo=N", // eslint-disable-line no-param-reassign
      id: variation.label
    }

    setVariationListIds(previousValues => [...previousValues, adjustObject])

  }


  // Remove itens from coverage list
  const handleRemoveItemCoverage = (coverage) => {

    const coverageListUpdate = coverageList.filter(item => item.label != coverage.label);

    setCoverageList(coverageListUpdate)
    setCoverageListData(coverageListUpdate)

    const adjustObject = {
      label: coverage.label += "#flg_Ativo=N", // eslint-disable-line no-param-reassign
      id: coverage.label
    }

    setCoverageListData(previousValues => [...previousValues, adjustObject])

  }

  // Add itens ins Coverage list
  const addCoverageInList = useCallback(() => {

    const coverageObject = {
      label:coverage,
      id: coverage
    }

    if(coverageObject.label == "00"){
      return
    }

    if(coverageObject.label == "BR"){
      setCoverageList([coverageObject])
      setCoverageListData([coverageObject])
      setCoverage("00")
      return;
    }

    // if is already add on list return false
    const existItem = coverageList.filter(item => item.id == coverageObject.id);
    const existItemData = coverageListData.filter(item => item.id == coverageObject.id);
    if (existItem.length > 0 || existItemData.length > 0){
      return;
    }
  
    setCoverageList(previousValues => [...previousValues, coverageObject])
    setCoverageListData(previousValues => [...previousValues, coverageObject])
    setCoverage("00")

  },
  [coverage, coverageList, coverageListData],
);

  return (
    <>
      
      <ModalNewName show>

        <div className='header'>
          <p className='headerLabel'>Publicações x Nomes</p>
        </div>

        <div className='mainDiv'>

          <label htmlFor="descricao">
            Nome
            <br />
            <input
              required
              maxLength={200}
              type="text"
              style={{backgroundColor: 'white'}}
              name="descricao"
              value={publicationName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPublicationName(e.target.value)}
              autoComplete="off"
            />
          </label>

          <br />
          <br />

          <div style={{display:"flex"}}>
            <label htmlFor="descricao" style={{width:"40%"}}>
              OAB
              <br />
              <input
                required
                maxLength={100}
                type="text"
                style={{backgroundColor: 'white'}}
                name="descricao"
                value={oabNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setOabNumber(e.target.value)}
                autoComplete="off"
              />
            </label>
        
            <label htmlFor="type" style={{width:"40%", marginLeft:"20px"}}>   
              UF da OAB        
              <select 
                className='desUFSelect'
                name="type"
                value={des_UfOab}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setDes_UfOab(e.target.value)}
                style={{backgroundColor:"white"}}
              >
                <option disabled value="00">Selecione...</option>
                <option value="AC">ACRE</option>
                <option value="AL">ALAGOAS</option>
                <option value="AP">AMAPA</option>
                <option value="AM">AMAZONAS</option>
                <option value="BA">BAHIA</option>
                <option value="CE">CEARÁ</option>
                <option value="DF">DISTRITO FEDERAL</option>
                <option value="ES">ESPÍRITO SANTO</option>
                <option value="GO">GOIÁS</option>
                <option value="MA">MARANHÃO</option>
                <option value="MT">MATO GROSSO</option>
                <option value="MS">MATO GROSSO DO SUL</option>
                <option value="MG">MINAS GERAIS</option>
                <option value="PA">PARÁ</option>
                <option value="PB">PARAÍBA</option>
                <option value="PR">PARANÁ</option>
                <option value="PE">PERNAMBUCO</option>
                <option value="PI">PIAUÍ</option>
                <option value="RR">RORAIMA</option>
                <option value="RO">RONDÔNIA</option>
                <option value="RJ">RIO DE JANEIRO</option>
                <option value="RN">RIO GRANDE DO NORTE</option>
                <option value="RS">RIO GRANDE DO SUL</option>
                <option value="SC">SANTA CATARINA</option>
                <option value="SP">SÃO PAULO</option>
                <option value="SE">SERGIPE</option>
                <option value="TO">TOCANTINS</option>

              </select>
            </label>  

            <label htmlFor="type" style={{marginLeft:"20px", width:"14%"}}>  
              Cortesia         
              <select 
                className='desUFSelect'
                name="type"
                value={flg_Cortesia}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFlg_Cortesia(e.target.value)}
                style={{backgroundColor:"white"}}
              >
                <option value="N">NÃO</option>
                <option value="S">SIM</option>   
              </select>
            </label>
          </div>
                         
          <br />

          <label htmlFor="descricao">
            Variação
            <br />
            <input
              maxLength={200}
              placeholder='Digite a variação, pressione Enter para confirmar'
              type="text"
              style={{backgroundColor: 'white', marginBottom:"10px"}}
              name="descricao"
              value={variation}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setVariation(e.target.value)}
              onKeyPress={(e) => handleListItemVariation(e)}
              autoComplete="off"
            />
          </label>

          <ItemList>

            {variationList.map(item => {
              return (
                <span>
                  <li style={{marginBottom:"1px"}}>{item.label.substring(0, item.label.indexOf("#"))}</li> 
                  <p className="buttonLinkClick" style={{marginBottom:"auto"}} onClick={() => handleRemoveItemVariation(item)}> 
                    Excluir
                  </p> 
                </span>
              )
            })} 

          </ItemList>

          <br />
          <br /> 

          <label htmlFor="descricao">
            Exclusão
            <br />
            <input
              maxLength={200}
              placeholder='Digite a exclusão, pressione Enter para confirmar'
              type="text"
              style={{backgroundColor: 'white', marginBottom:"10px"}}
              name="descricao"
              value={exclusion}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setExclusion(e.target.value)}
              onKeyPress={(e) => handleListItemExclusion(e)}
              autoComplete="off"
            />
          </label>

          <ItemList>

            {exclusionList.map(item => {
              return (
                <span>
                  <li style={{marginBottom:"1px"}}>{item.label.substring(0, item.label.indexOf("#"))}</li> 
                  <p className="buttonLinkClick" style={{marginBottom:"auto"}} onClick={() => handleRemoveItemExclusion(item)}> 
                    Excluir
                  </p> 
                </span>
              )
            })} 

          </ItemList>

          <br />
          <br /> 

          <label htmlFor="type">   
            <p>Abrangência</p>       
            <select 
              className='desUFSelect'
              name="type"
              value={coverage}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setCoverage(e.target.value)}
              style={{backgroundColor:"white", width:"60%", marginBottom:"5px"}}
            >
              <option value="00">Selecione...</option>
              <option value="AC">ACRE</option>
              <option value="AL">ALAGOAS</option>
              <option value="AP">AMAPA</option>
              <option value="AM">AMAZONAS</option>
              <option value="BA">BAHIA</option>
              <option value="CE">CEARÁ</option>
              <option value="DF">DISTRITO FEDERAL</option>
              <option value="ES">ESPÍRITO SANTO</option>
              <option value="GO">GOIÁS</option>
              <option value="MA">MARANHÃO</option>
              <option value="MT">MATO GROSSO</option>
              <option value="MS">MATO GROSSO DO SUL</option>
              <option value="MG">MINAS GERAIS</option>
              <option value="PA">PARÁ</option>
              <option value="PB">PARAÍBA</option>
              <option value="PR">PARANÁ</option>
              <option value="PE">PERNAMBUCO</option>
              <option value="PI">PIAUÍ</option>
              <option value="RR">RORAIMA</option>
              <option value="RO">RONDÔNIA</option>
              <option value="RJ">RIO DE JANEIRO</option>
              <option value="RN">RIO GRANDE DO NORTE</option>
              <option value="RS">RIO GRANDE DO SUL</option>
              <option value="SC">SANTA CATARINA</option>
              <option value="SP">SÃO PAULO</option>
              <option value="SE">SERGIPE</option>
              <option value="TO">TOCANTINS</option>
              <option value="UN">UNIÃO</option>
              <option value="BR">BRASIL TODO</option>

            </select>
          </label>

          <button
            style={{marginLeft:"35px"}}
            className="buttonLinkClick buttonInclude"
            type="button"
            onClick={addCoverageInList}
          >
            Adicionar Abrangência
          </button>

          <ItemList>

            {coverageList.map(item => {
              return (
                <span>
                  <li>{item.label}</li> 
                  <p className="buttonLinkClick" style={{marginBottom:"auto"}} onClick={() => handleRemoveItemCoverage(item)}> 
                    Excluir
                  </p> 
                </span>
              )
            })} 

          </ItemList>

        </div>
      
        <div className='footer'>
          <div style={{marginTop:"2%", float:"right", marginRight:"3%"}}>
            <div style={{float:'left'}}>
              <button 
                className="buttonClick"
                type='button'
                onClick={()=> saveNewName()}
                style={{width:'100px'}}
              >
                <FiSave />
                Salvar 
              </button>
            </div>

            <div style={{float:'left'}}>
              <button 
                className="buttonClick"
                type='button'
                onClick={()=> deleteNewName()}
                style={{width:'100px'}}
              >
                <AiOutlineDelete />
                Excluir
              </button>
            </div>
                        
            <div style={{float:'left', width:'100px'}}>
              <button 
                type='button'
                className="buttonClick"
                onClick={() => CloseNewNameModal()}
                style={{width:'100px'}}
              >
                <FaRegTimesCircle />
                Fechar
              </button>
            </div>
          </div>
        </div>

      </ModalNewName>

      {isLoading && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Carregando ...
          </div>
        </>
    )}
    
      {isSaving && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Salvando ...
          </div>
        </>
    )}

      {isDelete && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Excluindo ...
          </div>
        </>
    )}       
     
    </>
    
  )
  
}
export default NewNameModal;
