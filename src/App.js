import TypeText from "./components/TypeTest/TypeText"
import { ThemeProvider } from "styled-components"
import { GlobalStyles } from "./components/GlobalStyles"
import { useCountDown } from "./hooks/useCountdown"

const theme = {
  colors: {
    correct: "#000000",
    incorrect: "#d70000",
    notPressed: "#b7b7b7",
    main: "#ff360d",
  },

  font: {
    primary: "Atkinson Hyperlegible",
    fallback: "sans-serif",
  },
}

function App() {
  // const [timer, newTimer, clearNewTimer] = useCountDown()
  // const [total, hours, minutes, seconds] = timer
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <TypeText />
        {/* <h2>{seconds}</h2>
        <button onClick={() => newTimer(10)}>35 seconds</button>
        <button onClick={() => newTimer(0)}>resetTimer</button>
        <button onClick={() => clearNewTimer(10)}>start</button>

        <div>{total === 0 ? "test over" : "test going"}</div> */}
        <h1>this is a test</h1>
      </ThemeProvider>
    </div>
  )
}

export default App
