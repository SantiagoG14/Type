import { memo, useCallback } from "react";
import styled from "styled-components";
import TypeLetter from "./TypeLetter";
import { FEEDBACK } from "../../hooks/useTypeText";
import { Word } from "../../hooks/useTypeTest";

type TypeWordProps = { word: Word; position: number; curWordPos: number };
const Typeword = memo(function TypeWord({
  word,
  position,
  curWordPos,
}: TypeWordProps) {
  const underlineIncorrect = useCallback(() => {
    if (position < curWordPos) {
      return (
        word.filter(
          (letter) =>
            letter.feedback === FEEDBACK.INCORRECT ||
            letter.feedback === FEEDBACK.NOT_PRESSED ||
            letter.feedback === FEEDBACK.OUT_OF_BND,
        ).length > 0
      );
    }
    return false;
  }, [curWordPos]);
  return (
    <StyledTypeWord underline={underlineIncorrect()}>
      {word.map((letter) => (
        <TypeLetter letter={letter} key={letter.id} />
      ))}
    </StyledTypeWord>
  );
}, arePropsEqual);

function arePropsEqual(oldProps: TypeWordProps, newProps: TypeWordProps) {
  return (
    oldProps.word.length === newProps.word.length &&
    oldProps.position === newProps.position &&
    oldProps.curWordPos === newProps.curWordPos &&
    oldProps.word.every((letter, i) => {
      const newLetter = newProps.word[i];
      if (!newLetter) return false;
      return (
        letter.letter === newLetter.letter &&
        letter.id === newLetter.id &&
        letter.feedback === newLetter.feedback
      );
    })
  );
}

export default Typeword;

const StyledTypeWord = styled.div<{ underline: boolean }>`
  display: flex;
  font-size: 1.5rem;
  font-family: ${({ theme }) => theme.font.primary}, sans-serif;
  text-decoration: ${({ underline }) => (underline ? "underline" : "")};
  text-decoration-color: ${({ theme }) => theme.colors.incorrect};
  text-underline-offset: 0.35rem;
`;
