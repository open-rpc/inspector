import React from "react";
import { CssBaseline } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core";
import { lightTheme, darkTheme } from "../themes/openrpcTheme";
import useDarkMode from "use-dark-mode";
import Inspector from "./Inspector";

const App: React.FC = () => {
  const darkMode = useDarkMode();
  const theme = darkMode.value ? darkTheme : lightTheme;
  const reactJsonTheme = darkMode.value ? "summerfruit" : "summerfruit:inverted";

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Inspector onToggleDarkMode={darkMode.toggle} darkMode={darkMode.value} reactJsonTheme={reactJsonTheme}/>
    </MuiThemeProvider>
  );
};

export default App;
