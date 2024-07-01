/* eslint-disable react/jsx-indent */
import React, { useCallback, useEffect, useState } from 'react'
import Loader from 'react-spinners/ClipLoader';
import { useToast } from 'context/toast';
import { useConfirmBox } from 'context/confirmBox';
import { Overlay } from 'Shared/styles/GlobalStyle';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { FcRemoveImage } from 'react-icons/fc';
import { IMatterAttachValues } from '../../../Interfaces/IMatter';
import { DeleteMatterAttach, ListMatterAttach } from '../Services/MatterData'
import { Container, Content } from './styles'

const MatterAttach = (props) => {

    const { addToast } = useToast();
    const {matterId, refresh} = props;
    const { handleCaller, handleConfirmMessage, handleCancelMessage, isCancelMessage, isConfirmMessage } = useConfirmBox();
    const [isDeleting, setIsDeleting] = useState<boolean>(false)  
    const [matterApensoId, setMatterApensoId] = useState<number>(0)  
    const [statusPage, setStatusPage] = useState<string>('load')
    const [matterList, setMatterList] = useState<IMatterAttachValues[]>([])

    // first load
    useEffect(() => {

        LoadAttachFiles()   

    }, [refresh, matterId])

    // list attach values
    const LoadAttachFiles = async() => {
        try
        {
            if (!matterId){
                setStatusPage('')   
                return;
            }

            const matterList = await ListMatterAttach(matterId)
            setMatterList(matterList)
            setStatusPage('')
        }
        catch(ex: any)
        {
            setStatusPage('')
            addToast({
                type: 'info',
                title: 'Operação NÃO realizada',
                description: 'Houve uma falha na listagem dos processos anexados'
              });
        }
    }

    const handleDelete = useCallback(async() => {
        try
        {
            setStatusPage('delete')

            await DeleteMatterAttach(matterApensoId) 
            await LoadAttachFiles();
            handleCaller('')

            addToast({
                type: 'success',
                title: 'Operação realizada com sucesso',
                description: `O processo selecionado foi anexado com sucesso`,
            });

            setStatusPage('')
        }
        catch(ex: any)
        {
            setStatusPage('')
            addToast({
                type: 'info',
                title: 'Operação NÃO realizada',
                description: 'Houve uma falha na exclusão do apenso'
              }); 
        }
    
    },[matterApensoId])

    const handleOpenAttachMatter = (item: IMatterAttachValues) => {
        
        const url = `/matter/edit/advisory/${  item.matterAditionalId}`;
        window.open(url)
    }

    useEffect(() => {

        if (isConfirmMessage){
           
          if (isDeleting){
            handleDelete()
          }
    
          handleConfirmMessage(false)
          setIsDeleting(false)
        }
    
      },[isConfirmMessage])
    
      useEffect(() => {
        if (isCancelMessage){
          setIsDeleting(false)
        }

        handleCancelMessage(false)
    
      },[isCancelMessage])

      const handleDeleteApenso = (matterId: number) => {
        setMatterApensoId(matterId)
        setIsDeleting(true)
      }
    
    return (

        <>
            <Container>
                
                {matterList.length > 0 && (
                    <div className='objectResume'>
                        <header>Apensos </header>
                    </div>   
                )}

                <Content>
                    
                    {matterList.map(item => (
                        
                        <div key={item.matterNumber}>
                            <header>
                                {/* <FcOpenedFolder title='Clique para abrir a o processo apenso' onClick={() => handleOpenAttachMatter(item)}  /> */}
                                {` Pasta:  ${(item.folderName)} `}
                                <FcRemoveImage title='Clique para remover o processo apenso' onClick={() => handleDeleteApenso(item.matterAttachId)} />
                            </header>
                            <div>
                                <p>{` Processo:  ${(item.matterNumber)} `}</p>
                                <p>{` Cliente:  ${(item.customerName)} `}</p>
                                <p>{` Contrário:  ${(item.opossingName)} `}</p>
                            </div>    
                        </div>                        

                    ))}
                </Content>
 
            </Container>

            {statusPage != '' && (
                <>
                <Overlay />
                <div className='waitingMessage'>   
                    <Loader size={15} color="var(--blue-twitter)" /> 
                    &nbsp;&nbsp;
                    {statusPage === 'load' &&  <span>Aguarde...</span> }
                    {statusPage === 'delete' &&  <span>Deletando...</span> }
                </div>
                </>
            )}

            {isDeleting && (
                <ConfirmBoxModal
                  title="Exclusão de Processos Apenso"
                  caller="matterAttachDelete"
                  message="Confirma a exclusão deste processo anexado a esta pasta ?"
                />
            )}

        </>
    )
}


export default MatterAttach