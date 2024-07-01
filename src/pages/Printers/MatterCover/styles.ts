import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: auto;
  font-size: 12px;
  background-color: #EDF0F7;

 .waitingReport {
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    margin-left:49vw;
    color: var(--blue-twitter);
 }
  
  #buttonPrint{
    padding-top:0.5rem;
    padding-bottom:1rem;
    margin-bottom:1rem;
    border-bottom: 1px solid var(--secondary);
    font-size:0.75rem;
  }

  @media screen,print
  {

    b{
      font-weight:600;
    }

    .matter-cover-main
    {
      width:50vw;
      margin-left:25vw;
      font-size: 14px;
    }

    .matter-cover-folder
    {
      text-align: center;
      font-size: 20px;
      padding:0.5rem;
    }
    .matter-cover-action
    {
      text-align: center;
      padding:0.5rem;
    }

    .matter-cover-people
    {
      text-align: center;
      padding:0.5rem;
    }

    .matter-cover-lawyer
    {
      text-align: center;
      padding:0.5rem;
    }

    .matter-cover-matter
    {
      text-align: left;
      padding:0.5rem;
    }

    .matter-cover-matter p
    {
      line-height: 30px;
      padding:0.5rem;
    }

    .matter-cover-matterObject
    {
      text-align: justify;
      border: 1px solid;
      min-height: 100px;
    }

    .matter-cover-matterObject p
    {
      margin: 10px 15px 10px 15px;
      font-size: 12px;
    }

    .matter-cover-hrb
    {
      height: 2px;
      background-color: Black;
    }

    .matter-cover-hrb-2
    {
      height: 1px;
      background-color: Black;
    }
  }

  @media print
  {	

    #buttonPrint {
      display:none;
    }
    
    body
    {
      font-size: 12pt;
      padding: 0px;
      margin: 0px;
    }
    
    .print-toolbar, #gpjwebBar
    {
      display:none;
    }
    
      
    #workSpaceContainer
    {
      border-right: none;
    }
    

    .matter-cover-main
    {
      padding: 0 0 0 0;
      width: 80%;
      margin: 100px auto;
    }

    .matter-cover-folder
    {
      font-size: 20pt;
    }

    p
    {
      color: black;
    }

  }

`
