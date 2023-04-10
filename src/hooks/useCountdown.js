import { useEffect, useRef, useState } from "react"
import RestartButton from "../components/TypeTest/RestartButton"

export const useCountDown = (): [number[], []] => {
  const Ref = useRef(null)
  const [timer, setTimer] = useState([])

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date())
    const seconds = Math.floor((total / 1000) % 60)
    const minutes = Math.floor((total / 1000 / 60) % 60)
    const hours = Math.floor((total / 1000 / 60 / 60) % 24)
    return {
      total,
      hours,
      minutes,
      seconds,
    }
  }

  const startTimer = (e) => {
    const { total, hours, minutes, seconds } = getTimeRemaining(e)
    // console.log(total, hours, minutes, seconds)
    if (total >= 0) {
      setTimer([total, hours, minutes, seconds])
    }
  }

  const clearTimer = (e) => {
    const { total, hours, minutes, seconds } = getTimeRemaining(e)
    if (total >= 0) {
      setTimer([total, hours, minutes, seconds])
    }

    if (Ref.current) clearInterval(Ref.current)
    const id = setInterval(() => {
      startTimer(e)
    }, 1000)
    Ref.current = id
  }

  const getDeadTime = (seconds = 60) => {
    let deadline = new Date()
    deadline.setSeconds(deadline.getSeconds() + seconds)
    return deadline
  }

  const newTimer = (toDeadLineSeconds) => {
    resetTimer()
    startTimer(getDeadTime(toDeadLineSeconds))
  }

  const clearNewTimer = (toDeadLineSeconds) => {
    clearTimer(getDeadTime(toDeadLineSeconds))
  }

  const resetTimer = () => {
    clearNewTimer(0)
  }

  return [timer, newTimer, clearNewTimer]
}
