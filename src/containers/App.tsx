import React from "react";
import { CssBaseline } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core";
import { lightTheme, darkTheme } from "../themes/openrpcTheme";
import useDarkMode from "use-dark-mode";
import Inspector from "./Inspector";

interface IProps {
  url?: string;
  request?: any;
  darkMode?: boolean;
  hideToggleTheme?: boolean;
}

const App: React.FC<IProps> = (props) => {
  const darkMode = useDarkMode(props.darkMode);
  const theme = darkMode.value ? darkTheme : lightTheme;

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Inspector />
    </MuiThemeProvider>
  );
};

export default App;
