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
import { GrTextAlignCenter } from 'react-icons/gr';
import { GiReceiveMoney } from 'react-icons/gi'
import { HiOutlineDocumentDuplicate } from 'react-icons/hi'
import { useDefaultSettings } from 'context/defaultSettings';
import { Tab, Tabs } from 'Shared/styles/Tabs';
import { useHistory, useParams } from 'react-router-dom';
import MenuHamburguer from 'components/MenuHamburguer';
import { useMenuHamburguer } from 'context/menuHamburguer';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { Container, Content, TabContent, TollBar } from './styles';
import { ISelectData, ITabsEditMatterAdvisory } from '../../Interfaces/IMatter';
import MatterDetails from '../EditComponents/Details/Advisory'
import FinanceComponent from '../EditComponents/Finance'
import DocumentComponent from '../EditComponents/Document'
import FollowComponent from '../EditComponents/Follow'
import OrderComponent from '../EditComponents/Order'
import PeopleComponent from '../EditComponents/People'
import FileComponent from '../EditComponents/File'
import MatterAttach from '../EditComponents/Attach/Index';
import { ListCustomerData, ListLawyerData, ListOpossingData, ListPartsData, ListThirdyData } from '../EditComponents/Services/PeopleData';
import { VscTag } from 'react-icons/vsc';
import { FaTags } from "react-icons/fa";

const MatterAdivisory = () => {
  const history = useHistory();
  const {isMenuOpen, handleIsMenuOpen } = useMenuHamburguer();
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { permissionData } = useDefaultSettings();
  // const [tabsControl, setTabsControl] = useState<ITabsEditMatterAdvisory>({activeTab: 'matter'} as ITabsEditMatterAdvisory);
  const { id } = useParams() as { id: string; }

  // list async used on parts person tab
  const [customerList, setCustomerList] = useState<ISelectData[]>([])
  const [lawyerList, setLawyerList] = useState<ISelectData[]>([])
  const [opossingList, setOpossingList] = useState<ISelectData[]>([])
  const [thirdyList, setThirdyList] = useState<ISelectData[]>([])
  const [partsList, setPartsList] = useState<ISelectData[]>([])

    // states open tabs
    const [peopleTab, setPeopleTab] = useState<boolean>(false)
    const [orderTab, setOrderTab] = useState<boolean>(false)
    const [followTab, setFollowTab] = useState<boolean>(false)
    const [documentTab, setDocumentTab] = useState<boolean>(false)
    const [financeTab, setFinanceTab] = useState<boolean>(false)

  const handleTabs = (tabActive: string) => {

    // if (tabsControl.activeTab === tabActive){
    //   setTabsControl({activeTab: 'matter'} as ITabsEditMatterAdvisory);
    //   return;
    // }

    // set state as clicked on tab handle
    if (tabActive === 'peopleList') setPeopleTab(!peopleTab)
    if (tabActive === 'orderList') setOrderTab(!orderTab)
    if (tabActive === 'followList') setFollowTab(!followTab)
    if (tabActive === 'documentList') setDocumentTab(!documentTab)
    if (tabActive === 'financeList') setFinanceTab(!financeTab)

    // // Named tabs
    // setTabsControl({
    //   tab1: tabActive == 'matter',
    //   tab2: tabActive == 'peopleList',
    //   tab3: tabActive == 'orderList',
    //   tab4: tabActive == 'followList',
    //   tab5: tabActive == 'financeList',
    //   tab6: tabActive == 'documentList',
    //   activeTab: tabActive
    // })
  }

  const peopleRef = useRef<HTMLDivElement>(null)
  const followRef = useRef<HTMLDivElement>(null)

  const LoadPerson = async() => {

    setPartsList(await ListPartsData(1, 50, ''))
    setCustomerList(await ListCustomerData(""))
    setOpossingList(await ListOpossingData(''))
    setLawyerList(await ListLawyerData(""))
    setThirdyList(await ListThirdyData(""))

      // open people tab after load matter page
      if (peopleRef.current){
        peopleRef.current.click();
      }

      // open people tab after load matter page
      if (followRef.current){
        followRef.current.click();
      }
  }

  // const getClassTabActive = (tab: string) => {

  //   if (tabsControl.activeTab === tab){
  //     return "buttonTabActive"
  //   }

  //   return "buttonTabInactive"
  // }

  const handleLoadingPage = () => {
    setIsLoading(false)
  }

  useEffect(() => {
    LoadPerson()
  }, [])


  
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

            <div className='title first'>

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
                <FaTags color="#2c8ed6"/>
                Etiquetas
              </button>

            </div>

             <Tab active>

              <TabContent>

                <MatterDetails callbackList={{handleLoadingPage, registerAPI: setChildAPI}} />

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

              {orderTab && (
                <OrderComponent
                  matterId={id}
                  load={orderTab}
                />
              )}

            </Tab>

          </Tabs>

          {/* Follow List */}
          <Tabs>

          <div
            className='title'
            ref={followRef}
            onClick={() => handleTabs("followList")}
          >

              <button
                type='button'
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
                     numberOrigem=""
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
              >
                <HiOutlineDocumentDuplicate />
                Documentos
              </button>

            </div>

            {/* Finance List  */}
            {/* <Tabs>

              <div className='title'>

                <button type='button' className={getClassTabA ctive('financeList')} onClick={() => handleTabs("financeList")}>
                  <GiReceiveMoney />
                  Financeiro
                </button>

              </div>

              <Tab active={tabsControl.tab5}>

                <FinanceComponent />

              </Tab>

            </Tabs> */}

            {/* Document List */}
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

        <MatterAttach />

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

export default MatterAdivisory
