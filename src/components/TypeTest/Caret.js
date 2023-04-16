import React, { useMemo } from "react"
import { motion } from "framer-motion"
import styled from "styled-components"

export default function Caret({
  caretRef,
  curLeft,
  curTop,
  restartbuttonfocus,
}) {
  const cachedLeft = useMemo(() => curLeft, [curLeft])
  const cachedTop = useMemo(() => curTop, [curTop])
  return (
    <StyledCaret
      as={motion.div}
      ref={caretRef}
      animate={{ left: cachedLeft, top: cachedTop }}
      transition={{ ease: "linear", duration: 0.1 }}
      imgurl={process.env.PUBLIC_URL + "/carrot.png"}
      restartbuttonfocus={restartbuttonfocus}
    ></StyledCaret>
  )
}

const StyledCaret = styled.div`
  height: 2rem;
  width: 0.5rem;
  background-image: url(${({ imgurl }) => imgurl});
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
`
