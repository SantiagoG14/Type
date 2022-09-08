import React from "react"
import { FEEDBACK } from "../../hooks/useTypeText"

export default function TypeLetter({ letter }) {
  return (
    <div
      className={
        letter.feedback === FEEDBACK.CORRECT
          ? "letter green"
          : letter.feedback === FEEDBACK.INCORRECT
          ? "letter red"
          : letter.feedback === FEEDBACK.OUT_OF_BND
          ? "letter out-of-bnds"
          : "letter"
      }
    >
      {letter.letter}
    </div>
  )
}
