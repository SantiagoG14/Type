import React from "react"
import { motion } from "framer-motion"

export default function Caret({ caretRef, curLeft, curTop }) {
  return (
    <motion.div
      className="caret"
      ref={caretRef}
      style={{ left: "0px" }}
      animate={{ left: curLeft, top: curTop }}
      transition={{ ease: "linear", duration: 0.11 }}
    ></motion.div>
  )
}
