import React from "react";
import { CssBaseline } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core";
import { lightTheme, darkTheme } from "../themes/openrpcTheme";
import useDarkMode from "use-dark-mode";
import Inspector from "./Inspector";
import useQueryParams from "../hooks/useQueryParams";

const App: React.FC = () => {
  const darkMode = useDarkMode();
  const [query] = useQueryParams();
  const theme = darkMode.value ? darkTheme : lightTheme;

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Inspector
        onToggleDarkMode={darkMode.toggle}
        darkMode={darkMode.value}
        url={query.url}
        openrpcMethodObject={query.openrpcMethodObject}
        request={query.request}
      />;
    </MuiThemeProvider>
  );
};

export default App;
