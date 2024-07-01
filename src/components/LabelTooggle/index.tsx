/* eslint-disable */

import React, { useState } from 'react';
import { RemoveSpecialCharacters } from 'Shared/utils/commonFunctions';
import { Content } from './styles'

interface DescriptionData
{
  description: string;
  limitCharacters: number;
  searchTerm?: string;
}

const LabelTooggle:React.FC<DescriptionData> = ({ description, limitCharacters, searchTerm }) =>
{
  const [showMoreText, setShowMoreText] = useState<Boolean>(false)
  const hasMoreThanLmit = description.length > limitCharacters
  const buttonTitle = !showMoreText? "Ver mais": "Ver menos"

  // remove some special characters
  searchTerm = RemoveSpecialCharacters(searchTerm??"")

  if (searchTerm)
  {
    try{

      var regex = new RegExp(searchTerm, 'gi');   //g -> global | i -> insensitive mode
      const searchTermReplace = `<span style='background-color:#DFFF00'>${searchTerm}</span>`
      description = description.replace(regex, searchTermReplace)
    }
    catch {
      console.log("erro na publicação nome : ", searchTerm)
    }
  }

  return (

    <>
      {/* when is > than limit show only substring relative */}
      { (hasMoreThanLmit && !showMoreText) &&

        <Content>
          <span dangerouslySetInnerHTML={{ __html: description.substring(0, limitCharacters) + " ..." }} />
          <button title={description} onClick={() => setShowMoreText(!showMoreText)}>{buttonTitle}</button>
        </Content>
      }

      {/* When is > than limit and was clicked and show more, show all text */}
      { (hasMoreThanLmit && showMoreText) &&
          <Content>
            <span dangerouslySetInnerHTML={{ __html: description }} />
            <button onClick={() => setShowMoreText(!showMoreText)}>{buttonTitle}</button>
          </Content>
      }

      {/* When ltngth is < than limit shows all text without button options */}
      { (!hasMoreThanLmit) &&
        <Content dangerouslySetInnerHTML={{ __html: description }} />
      }

    </>
  )
}

export default LabelTooggle;
