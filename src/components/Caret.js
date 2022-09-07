import React from "react"
import { motion } from "framer-motion"

export default function Caret({ caretRef, curLeft }) {
  return (
    <motion.div
      className="caret"
      ref={caretRef}
      style={{ left: "0px" }}
      animate={{ left: curLeft }}
      transition={{ ease: "easeInOut", duration: 0.12 }}
    ></motion.div>
  )
}
