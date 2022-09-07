import React, { useRef } from "react"

export default function Test() {
  const sqRef = useRef()

  function handleClick() {
    sqRef.current.animate({ left: "2rem" }, 1000)
    sqRef.current.style.left = "2rem"
  }
  return (
    <>
      <button onClick={handleClick}>move</button>
      <div className="sq" ref={sqRef} style={{ left: 0 }}></div>
    </>
  )
}
