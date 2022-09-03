import React from "react"
import TypeLetter from "./TypeLetter"
import { v4 as uuidv4 } from "uuid"

export default function TypeWord({ word }) {
  return (
    <div className="word">
      {word.map((letter) => (
        <TypeLetter letter={letter} />
      ))}
    </div>
  )
}
