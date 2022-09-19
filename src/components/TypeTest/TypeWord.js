import React from "react"
import styled from "styled-components"
import TypeLetter from "./TypeLetter"

export default function TypeWord({ word, currentWordRef }) {
  return (
    <StyledTypeWord ref={currentWordRef}>
      {word.map((letter) => (
        <TypeLetter letter={letter} />
      ))}
    </StyledTypeWord>
  )
}

const StyledTypeWord = styled.div`
  display: flex;
  margin-right: 1rem;
  margin-bottom: 1rem;
  /* margin-top: 6px; */
  font-size: 1.5rem;
  font-family: ${({ theme }) => theme.font.primary}, sans-serif;
`
