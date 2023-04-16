import styled from "styled-components"
import TypeLetter from "./TypeLetter"
import { FEEDBACK } from "../../hooks/useTypeTest"
import { useMemo, memo } from "react"

export default memo(function TypeWord({
  word,
  currentWordRef,
  myPosition,
  curWordPos,
}) {
  const cachedWord = useMemo(() => word, [word])
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
      {cachedWord.map((letter) => (
        <TypeLetter letter={letter} key={letter.id} />
      ))}
    </StyledTypeWord>
  )
})

const StyledTypeWord = styled.div`
  display: flex;
  font-size: 1.5rem;
  font-family: ${({ theme }) => theme.font.primary}, sans-serif;
  text-decoration: ${({ underline }) => (underline ? "underline" : "")};
  text-decoration-color: ${({ theme }) => theme.colors.incorrect};
  text-underline-offset: 0.35rem;
  margin-right: 12px;
  margin-bottom: 12px;
  font-weight: 400;
`
