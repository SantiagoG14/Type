import React from "react"
import { FEEDBACK } from "../../hooks/useTypeText"
import styled from "styled-components"

export default function TypeLetter({ letter }) {
  return (
    <StyledTypeLetter feedback={letter.feedback}>
      {letter.letter}
    </StyledTypeLetter>
  )
}

export const StyledTypeLetter = styled.div`
  color: ${({ feedback, theme }) =>
    feedback === FEEDBACK.CORRECT
      ? theme.colors.correct
      : feedback === FEEDBACK.INCORRECT
      ? theme.colors.incorrect
      : feedback === FEEDBACK.OUT_OF_BND
      ? theme.colors.incorrect
      : theme.colors.notPressed};
`
