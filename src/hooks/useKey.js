import { useEffect, useRef } from "react"

export default function useKey(key, cb) {
  const callbackRef = useRef(cb)
  console.log(callbackRef)

  useEffect(() => {
    callbackRef.current = cb
  })
  useEffect(() => {
    function handle(event) {
      callbackRef.current(event)
      console.log(event.code)
    }
    document.addEventListener("keypress", handle)
    return () => document.removeEventListener("keypress", handle)
  }, [key])
}
