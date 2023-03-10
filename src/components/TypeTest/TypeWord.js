import React, { useMemo } from "react"
import styled from "styled-components"
import TypeLetter from "./TypeLetter"
import { FEEDBACK } from "../../hooks/useTypeText"
import { AnimatePresence, motion } from "framer-motion"

export default function TypeWord({
  word,
  currentWordRef,
  myPosition,
  curWordPos,
}) {
  const underlineIncorrect = () => {
    if (myPosition < curWordPos) {
      return (
        word.filter(
          (letter) =>
            letter.feedback === FEEDBACK.INCORRECT ||
            letter.feedback === FEEDBACK.NOT_PRESSED ||
            letter.feedback === FEEDBACK.OUT_OF_BND
        ).length > 0
      )
    }
    return false
  }
  return (
    <StyledTypeWord ref={currentWordRef} underline={underlineIncorrect()}>
      {word.map((letter) => (
        <TypeLetter letter={letter} />
      ))}
    </StyledTypeWord>
  )
}

const StyledTypeWord = styled.div`
  display: flex;
  margin-right: 12px;
  margin-bottom: 12px;
  font-size: 1.5rem;
  font-family: ${({ theme }) => theme.font.primary}, sans-serif;
  text-decoration: ${({ underline }) => (underline ? "underline" : "")};
  text-decoration-color: ${({ theme }) => theme.colors.incorrect};
  text-underline-offset: 0.35rem;
`
