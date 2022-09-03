import React, { useState } from "react"
import TypeWord from "./TypeWord"
import { getWordsArray, getLettersArray } from "../functionality/words"
export default function Carrot({ text }) {
  const [typeText, setTypeText] = useState(
    getWordsArray(text).map((word) => getLettersArray(word))
  )

  return (
    <div className="typeActivity">
      <div className="caret"></div>
      <div className="TypeTextWordWrapper">
        {typeText.map((word, p) => (
          <TypeWord word={word} key={p} />
        ))}
      </div>
    </div>
  )
}
