import TypeText from "./components/TypeTest/TypeText";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./components/GlobalStyles";
import { useMemo } from "react";

function App() {
  const theme = useMemo(
    () => ({
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
    }),
    [],
  );
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <TypeText />
      </ThemeProvider>
    </div>
  );
}

export default App;
