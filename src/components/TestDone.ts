import React from "react"
import { FEEDBACK } from "../hooks/useTypeTest"
import { StyledButton } from "./TypeTest/RestartButton"

export default function TestDone({ state }) {
  const getFeedback = (feedback) => {
    const correct = state.tt.flatMap((word) =>
      word.filter((obj) => obj.feedback === feedback)
    )
    return correct.length
  }

  return (
    <div>
      <div>
        <p>test type</p>
        <p>{state.tc.mode}</p>
      </div>

      <div>
        <p>characters</p>
        <p>{`${getFeedback(FEEDBACK.CORRECT)}/${getFeedback(
          FEEDBACK.INCORRECT
        )}`}</p>
      </div>

      <div>
        <StyledButton message="Next Test">
          <span className="material-symbols-outlined">navigate_next</span>
        </StyledButton>

        <StyledButton message="Restart Test">
          <span className="material-symbols-outlined">restart_alt</span>
        </StyledButton>
      </div>
    </div>
  )
}
