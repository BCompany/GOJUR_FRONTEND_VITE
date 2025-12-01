/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-indent */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { HeaderPage } from 'components/HeaderPage';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { ImMenu3, ImMenu4 } from 'react-icons/im';
import { AiOutlineArrowLeft, AiOutlineFolderOpen, AiOutlineFileSearch } from 'react-icons/ai';
import { BsFillPeopleFill } from 'react-icons/bs';
import { GiReceiveMoney } from 'react-icons/gi'
import { GrTextAlignCenter } from 'react-icons/gr';
import { GoLaw } from 'react-icons/go';
import { HiOutlineDocumentDuplicate } from 'react-icons/hi';
import { Tab, Tabs } from 'Shared/styles/Tabs';
import { useHistory, useParams } from 'react-router-dom';
import MenuHamburguer from 'components/MenuHamburguer';
import { useMenuHamburguer } from 'context/menuHamburguer';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { useDefaultSettings } from 'context/defaultSettings';
import { Container, Content, TabContent, TollBar } from './styles';
import { ISelectData } from '../../Interfaces/IMatter';
import MatterDetails from '../EditComponents/Details/Legal'
import FinanceComponent from '../EditComponents/Finance'
import DocumentComponent from '../EditComponents/Document'
import FollowComponent from '../EditComponents/Follow'
import OrderComponent from '../EditComponents/Order'
import CourtComponent from '../EditComponents/Court'
import PeopleComponent from '../EditComponents/People'
import FileComponent from '../EditComponents/File'
import { ListCustomerData, ListLawyerData, ListOpossingData, ListPartsData, ListThirdyData } from '../EditComponents/Services/PeopleData';
import { VscTag } from 'react-icons/vsc';

const MatterLegal = () => {
  const history = useHistory();
  const { isMenuOpen, handleIsMenuOpen } = useMenuHamburguer();
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { permissionData } = useDefaultSettings();
  // const [tabsControl, setTabsControl] = useState<ITabsEditMatterLegal>({activeTab: 'matter'} as ITabsEditMatterLegal);
  const { id } = useParams() as { id: string; }

  // list async used on parts person tab
  const [customerList, setCustomerList] = useState<ISelectData[]>([])
  const [lawyerList, setLawyerList] = useState<ISelectData[]>([])
  const [opossingList, setOpossingList] = useState<ISelectData[]>([])
  const [thirdyList, setThirdyList] = useState<ISelectData[]>([])
  const [partsList, setPartsList] = useState<ISelectData[]>([])
  const [redirectPublicationButton, setRedirectPublicationButton] = useState<boolean>(false)

  // states open tabs
  const [peopleTab, setPeopleTab] = useState<boolean>(false)
  const [orderTab, setOrderTab] = useState<boolean>(false)
  const [courtTab, setCourtTab] = useState<boolean>(false)
  const [followTab, setFollowTab] = useState<boolean>(false)
  const [documentTab, setDocumentTab] = useState<boolean>(false)
  const [financeTab, setFinanceTab] = useState<boolean>(false)
  const [numberOrigem, setNumberOrigem] = useState<string>('')

  const handleTabs = (tabActive: string) => {

    // set state as clicked on tab handle
    if (tabActive === 'peopleList') setPeopleTab(!peopleTab)
    if (tabActive === 'orderList') setOrderTab(!orderTab)
    if (tabActive === 'courtList') setCourtTab(!courtTab)
    if (tabActive === 'followList') setFollowTab(!followTab)
    if (tabActive === 'documentList') setDocumentTab(!documentTab)
    if (tabActive === 'financeList') setFinanceTab(!financeTab)
  }

  const peopleRef = useRef<HTMLDivElement>(null)
  const followRef = useRef<HTMLDivElement>(null)

  const LoadPerson = async () => {

    // when is call bay publication show button to return
    const showRedirectButton = localStorage.getItem('@GoJur:redirectFromPublication')
    if (showRedirectButton === 'S') {
      setRedirectPublicationButton(true)
      localStorage.removeItem('@GoJur:redirectFromPublication')
    }

    setPartsList(await ListPartsData(1, 50, ''))
    setCustomerList(await ListCustomerData(""))
    setOpossingList(await ListOpossingData(''))
    setLawyerList(await ListLawyerData(""))
    setThirdyList(await ListThirdyData(""))

    // open people tab after load matter page
    if (peopleRef.current) {
      peopleRef.current.click();
    }

    // open people tab after load matter page
    if (followRef.current) {
      followRef.current.click();
    }
  }

  const handleLoadingPage = () => {
    setIsLoading(false)
  }

  useEffect(() => {
    LoadPerson()
  }, [])

  const handleMatterNumberCallback = (matterNumber: string) => {

    setNumberOrigem(matterNumber)
  }

  const handleCourtSaveCallback = () => {

    // when user is with follow tab open and include new court - simulate close and reopen tab to reload lists
    if (followRef.current && followTab) {
      followRef.current.click();    // close tab follow
      followRef.current.click();    // reopen to reload lists
    }
  }



const [childAPI, setChildAPI] = useState(null);

const handleCallChild = () => {
    if (childAPI?.openModal) {
      childAPI.openModal();
    }
  };


  // Matter legal details screeen
  return (

    <Container>

      <HeaderPage />

      <TollBar>

        <div className="buttonReturn">
          <button
            className="buttonLinkClick"
            title="Clique para retornar a lista de processos"
            onClick={() => history.push('../../../matter/list')}
            type="submit"
          >
            <AiOutlineArrowLeft />
            Retornar
          </button>
        </div>

        {redirectPublicationButton && (

          <div className="buttonReturn">
            <button
              className="buttonLinkClick"
              title="Clique para retornar a lista de publicação"
              onClick={() => history.push('../../../publication')}
              type="submit"
            >
              <AiOutlineArrowLeft />
              Voltar a publicação
            </button>
          </div>
        )}

        <div className="hamburguerMenu">
          <button
            id="options"
            type="button"
            onClick={() => handleIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <ImMenu4 /> : <ImMenu3 />}
          </button>
        </div>

        {isMenuOpen ? (
          <MenuHamburguer name='matterOptions' />
        ) : null}

      </TollBar>

      <Content>

        {/* Matter */}
        <Tabs>

          <div
            className='title first'
            onClick={() => handleTabs("matter")}
          >

            <button
              type='button'
            >
              <AiOutlineFolderOpen />
              Processo
            </button>


            <button
              type="button"
              onClick={handleCallChild}
            >
              <VscTag />
              Etiquetas
            </button>


          </div>

          <Tab active>

            <TabContent>

              <MatterDetails callbackList={{ handleLoadingPage, handleMatterNumberCallback, registerAPI: setChildAPI }} />

            </TabContent>

          </Tab>

        </Tabs>

        {/* People List */}
        <Tabs>

          <div
            className='title'
            ref={peopleRef}
            onClick={() => handleTabs("peopleList")}
          >

            <button
              type='button'
            >
              <BsFillPeopleFill />
              Pessoas
            </button>

          </div>

          <Tab active={peopleTab}>

            {peopleTab && (
              <PeopleComponent
                matterId={id}
                customerList={customerList}
                lawyerList={lawyerList}
                opossingList={opossingList}
                thirdyList={thirdyList}
                partsList={partsList}
                load={peopleTab}
              />
            )}

          </Tab>

        </Tabs>

        {/* Order List */}
        <Tabs>

          <div
            className='title'
            onClick={() => handleTabs("orderList")}
          >

            <button
              type='button'
            >
              <AiOutlineFileSearch />
              Pedido do Processo
            </button>

          </div>

          <Tab active={orderTab}>

            {/* Render order componenet */}
            {orderTab && (
              <OrderComponent
                matterId={id}
                load={orderTab}
              />
            )}

          </Tab>

        </Tabs>

        <Tabs>

          <div
            className='title'
            onClick={() => handleTabs("courtList")}
          >

            <button
              type='button'
            >
              <GoLaw />
              Fórum / Instancia
            </button>

          </div>

          <Tab active={courtTab}>

            {/* Render court componenet */}
            {courtTab && (
              <CourtComponent
                matterId={id}
                numberOrigem={numberOrigem}
                handleReloadFollowTab={handleCourtSaveCallback}
                load={courtTab}
              />
            )}

          </Tab>

        </Tabs>

        {/* Follow List */}
        <Tabs>

          <div
            className='title'
            ref={followRef}   // handle to auto clicked in the first open
            onClick={() => handleTabs("followList")}
          >

            <button
              type='button'
            // className={getClassTabActive('followList')}
            >
              <GrTextAlignCenter />
              Acompanhamentos
            </button>

          </div>

          <Tab active={followTab}>

            {followTab && (

              <>
                <FollowComponent
                  matterId={id}
                  numberOrigem={numberOrigem}
                  load={followTab}
                />

                <FileComponent
                  matterId={Number(id)}
                  load={followTab}
                  sharedFile={false}
                  fromModal=""
                />
              </>
            )}

          </Tab>

        </Tabs>

        {/* Finance List */}
        {(permissionData.financial === 'S' || permissionData.adm == 'S') && (

          <Tabs>

            <div
              className='title'
              onClick={() => handleTabs("financeList")}
            >
              <button
                type='button'
              >
                <GiReceiveMoney />
                Financeiro
              </button>

            </div>

            <Tab active={financeTab}>

              <FinanceComponent
                matterId={id}
                load={financeTab}
              />

            </Tab>

          </Tabs>

        )}


        {/* Document List */}
        <Tabs>

          <div
            className='title'
            onClick={() => handleTabs("documentList")}
          >

            <button
              type='button'
            // className={getClassTabActive('documentList')}
            >
              <HiOutlineDocumentDuplicate />
              Documentos
            </button>

          </div>

          <Tab active={documentTab}>

            {documentTab && (
              <DocumentComponent
                matterId={id}
                load={documentTab}
              />
            )}

          </Tab>

        </Tabs>

        <br />
        <br />
        <br />

      </Content>

      {isLoading && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp; Aguarde...
          </div>
        </>
      )}

    </Container>

  )
}

export default MatterLegal
