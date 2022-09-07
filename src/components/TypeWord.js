import React from "react"
import TypeLetter from "./TypeLetter"

export default function TypeWord({ word, currentWordRef }) {
  return (
    <div className="word" ref={currentWordRef}>
      {word.map((letter) => (
        <TypeLetter letter={letter} />
      ))}
    </div>
  )
}
