import React from "react"
import { FEEDBACK } from "../../hooks/useTypeTest"
import styled from "styled-components"
import { memo } from "react"

export default memo(function TypeLetter({ letter }) {
  return (
    <StyledTypeLetter feedback={letter.feedback}>
      {letter.letter}
    </StyledTypeLetter>
  )
})

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
