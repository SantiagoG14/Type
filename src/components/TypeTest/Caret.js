import React from "react"
import { motion } from "framer-motion"
import styled from "styled-components"

export default function Caret({
  caretRef,
  curLeft,
  curTop,
  restartbuttonfocus,
}) {
  return (
    <StyledCaret
      as={motion.div}
      ref={caretRef}
      animate={{ left: curLeft, top: curTop }}
      transition={{ ease: "linear", duration: 0.13 }}
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
  opacity: ${({ restartbuttonfocus }) =>
    restartbuttonfocus === "true" ? 0 : 1};
  transition: opacity 200ms ease;
`
