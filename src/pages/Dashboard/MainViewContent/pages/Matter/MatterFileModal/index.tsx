/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useState, ChangeEvent, useEffect } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { useDevice } from "react-use-device";
import FileComponent from '../EditComponents/File'
import { FileMatterModal, FileMatterModalMobile} from './styles';

const MatterFileModal =  (props) => {
  const {handleCloseMatterFileModal, matterFileId, matterFilePlace} = props.callbackFunction
  const [open, setOpen] = useState<boolean>(true)
  const { isMOBILE } = useDevice();

  return (
    <>    
      {!isMOBILE && ( 
      <FileMatterModal show>    
        <div className='header'>
          <p className='headerLabel'>Documentos</p>
        </div>

        <div className='mainDiv'>
          <FileComponent
            matterId={Number(matterFileId)}
            load={open}
            sharedFile={false}
            fromModal={matterFilePlace}
          /> 
        </div>
      
        <div className='footer'>
          <div style={{marginTop:"1%", float:"right", marginRight:"3%"}}>            
            <div style={{float:'left', width:'100px'}}>
              <button 
                type='button'
                className="buttonClick"
                onClick={() => handleCloseMatterFileModal()}
                style={{width:'100px'}}
              >
                <FaRegTimesCircle />
                Fechar
              </button>
            </div>
          </div>
        </div>
      </FileMatterModal>      
      )}

      {isMOBILE && ( 
      <FileMatterModalMobile show>    
        <div className='header'>
          <p className='headerLabel'>Documentos</p>
        </div>

        <div className='mainDiv'>
          <FileComponent
            matterId={Number(matterFileId)}
            load={open}
            sharedFile={false}
            fromModal={matterFilePlace}
          /> 
        </div>
      
        <div className='footer'>
          <div style={{marginTop:"1%", float:"right", marginRight:"3%"}}>            
            <div style={{float:'left', width:'100px'}}>
              <button 
                type='button'
                className="buttonClick"
                onClick={() => handleCloseMatterFileModal()}
                style={{width:'100px'}}
              >
                <FaRegTimesCircle />
                Fechar
              </button>
            </div>
          </div>
        </div>
      </FileMatterModalMobile>      
      )}

    </>
    
  )
  
}
export default MatterFileModal;
