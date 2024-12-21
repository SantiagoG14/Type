import { motion } from "framer-motion";
import styled from "styled-components";
import CaretUrl from "../../assets/carrot.png";
import { forwardRef } from "react";
import { useCaret, UserCaretProps } from "../../hooks/useCaret";

const Caret = forwardRef<HTMLDivElement, UserCaretProps>(function Caret(
  { clp, cwp, wordsWrapperRef },
  ref,
) {
  const { caretTop, caretLeft } = useCaret({
    cwp,
    clp,
    wordsWrapperRef,
  });

  return (
    <StyledCaret
      as={motion.div}
      ref={ref}
      animate={{ x: caretLeft, y: caretTop }}
      transition={{ ease: "linear", duration: 0.1 }}
    >
      <img src={CaretUrl} height={28} width={6} />
    </StyledCaret>
  );
});

export default Caret

const StyledCaret = styled.div`
  height: 2rem;
  width: 0.5rem;
  background-repeat: no-repeat;
  background-size: contain;
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  /* animation: afk 1000ms ease;
  animation-iteration-count: infinite; */

  @keyframes afk {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }
`;
