import React, { useState, useEffect, ChangeEvent } from "react";
import SplitPane from "react-split-pane";
import JSONRPCRequest from "./JSONRPCRequest";
import PlayCircle from "@material-ui/icons/PlayCircleFilled";
import { IconButton, AppBar, Toolbar, Typography, Button, InputBase, CssBaseline } from "@material-ui/core";
import { Client, RequestManager, HTTPTransport, WebSocketTransport } from "@open-rpc/client-js";
import ReactJson from "react-json-view";
import { MuiThemeProvider } from "@material-ui/core";
import { lightTheme, darkTheme } from "../themes/openrpcTheme";
import useDarkMode from "use-dark-mode";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import WbSunnyIcon from "@material-ui/icons/WbSunny";

interface IProps {
  url?: string;
  request?: any;
  darkMode?: boolean;
}

const useClient = (url: string): [Client] => {
  const [client, setClient] = useState();
  useEffect(() => {
    let transport;
    if (url.includes("http://") || url.includes("https://")) {
      transport = HTTPTransport;
    }
    if (url.includes("ws://")) {
      transport = WebSocketTransport;
    }
    if (!transport) {
      return console.error(`No Transport Found for url: ${url}`);
    }
    try {
      const t = new transport(url);
      const c = new Client(new RequestManager([t]));
      setClient(c);
    } catch (e) {
      console.error(e);
    }
  }, [url]);
  return [client];
}

function useCounter(defaultValue: number): [number, () => void] {
  const [counter, setCounter] = useState(defaultValue);

  const incrementCounter = () => {
    setCounter(counter + 1);
  };

  return [counter, incrementCounter];
}

const Inspector: React.FC<IProps> = (props) => {
  const darkMode = useDarkMode();
  const theme = darkMode.value ? darkTheme : lightTheme;
  const reactJsonTheme = darkMode.value ? "summerfruit" : "summerfruit:inverted";

  const [id, incrementId] = useCounter(0);
  const [json, setJson] = useState(props.request || {
    jsonrpc: "2.0",
    method: "",
    params: [],
    id,
  });
  const [results, setResults] = useState();
  const [url, setUrl] = useState(props.url || "");
  const [client] = useClient(url);

  const handlePlayButton = async () => {
    if (client) {
      incrementId();
      try {
        const result = await client.request(json.method, json.params);
        setResults({ jsonrpc: "2.0", result });
      } catch (e) {
        setResults(e);
      }
    }
  };

  const handleClearButton = () => {
    setResults(undefined);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ height: "100%" }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <img
              height="30"
              alt="openrpc-logo"
              style={{ marginRight: "10px" }}
              src="https://github.com/open-rpc/design/raw/master/icons/open-rpc-logo-noText/open-rpc-logo-noText%20(PNG)/128x128.png" //tslint:disable-line
            />
            <Typography variant="h6" color="textSecondary">Inspector</Typography>
            <IconButton onClick={handlePlayButton}>
              <PlayCircle />
            </IconButton>
            <InputBase
              value={url}
              placeholder="Enter a JSON-RPC server URL"
              onChange={
                (event: ChangeEvent<HTMLInputElement>) => setUrl(event.target.value)
              }
              fullWidth
              style={{ background: "rgba(0,0,0,0.1)", borderRadius: "4px", padding: "0px 10px", marginRight: "5px" }}
            />
            <IconButton onClick={darkMode.toggle}>
              {darkMode.value ? <Brightness3Icon /> : <WbSunnyIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <div style={{ display: "flex", marginBottom: "-80px" }}>
          <SplitPane split="vertical" minSize={100} maxSize={-100} defaultSize={"35%"} style={{ flexGrow: 1 }}>
            <div style={{ width: "99%", padding: "10px" }}>
              <JSONRPCRequest
                json={{ ...json, id: id.toString() }}
                onChange={setJson}
                reactJsonTheme={reactJsonTheme}
              />
            </div>
            <div style={{ height: "100%", padding: "10px", overflowY: "auto", paddingBottom: "80px" }}>
              {results &&
                <Button
                  style={{ position: "absolute", top: "15px", right: "15px", zIndex: 1 }}
                  onClick={handleClearButton}>
                  Clear
                </Button>
              }
              {results &&
                <ReactJson
                  src={results ? {...results, id: (id - 1).toString()} : null}
                  name={false}
                  displayDataTypes={false}
                  displayObjectSize={false}
                  theme={reactJsonTheme}
                />}
            </div>
          </SplitPane >
        </div>
      </div>
    </MuiThemeProvider>
  );
};

export default Inspector;
