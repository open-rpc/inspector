import React, { useState, useEffect, ChangeEvent, Dispatch, useRef } from "react";
import SplitPane from "react-split-pane";
import JSONRPCRequestEditor from "./JSONRPCRequestEditor";
import PlayCircle from "@material-ui/icons/PlayCircleFilled";
import { IconButton, AppBar, Toolbar, Typography, Button, InputBase } from "@material-ui/core";
import { Client, RequestManager, HTTPTransport, WebSocketTransport } from "@open-rpc/client-js";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import { JSONRPCError } from "@open-rpc/client-js/build/Error";
import { MethodObject } from "@open-rpc/meta-schema";
import MonacoEditor from "@etclabscore/react-monaco-editor";

const errorToJSON = (error: JSONRPCError | undefined): any => {
  if (!error) {
    return;
  }
  return {
    code: error.code,
    message: error.message,
    data: error.data,
  };
};

interface IProps {
  url?: string;
  request?: any;
  darkMode?: boolean;
  hideToggleTheme?: boolean;
  openrpcMethodObject?: MethodObject;
  onToggleDarkMode?: () => void;
}

const useClient = (url: string): [Client, JSONRPCError | undefined, Dispatch<JSONRPCError | undefined>] => {
  const [client, setClient] = useState();
  const [error, setError] = useState();
  useEffect(() => {
    let transport;
    if (url.includes("http://") || url.includes("https://")) {
      transport = HTTPTransport;
    }
    if (url.includes("ws://")) {
      transport = WebSocketTransport;
    }
    try {
      const clientTransport = transport || HTTPTransport;
      const t = new clientTransport(url);
      const c = new Client(new RequestManager([t]));
      setClient(c);
      c.onError((e) => {
        console.log("onError", e); //tslint:disable-line
        setError(e);
      });
    } catch (e) {
      setError(e);
    }
  }, [url]);
  return [client, error, setError];
};

function useCounter(defaultValue: number): [number, () => void] {
  const [counter, setCounter] = useState(defaultValue);

  const incrementCounter = () => {
    setCounter(counter + 1);
  };

  return [counter, incrementCounter];
}

const Inspector: React.FC<IProps> = (props) => {
  const [id, incrementId] = useCounter(0);
  const [json, setJson] = useState(props.request || {
    jsonrpc: "2.0",
    method: "",
    params: [],
    id,
  });
  const editorRef = useRef();
  const [results, setResults] = useState();
  const [url, setUrl] = useState(props.url || "");
  const [client, error, setError] = useClient(url);
  useEffect(() => {
    if (props.openrpcMethodObject) {
      setJson({
        jsonrpc: "2.0",
        method: props.openrpcMethodObject.name,
        params: json.params,
        id: id.toString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (json) {
      setJson({
        ...json,
        jsonrpc: "2.0",
        id: id.toString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (props.url) {
      setUrl(props.url);
    }
  }, [props.url]);

  const handlePlayButton = async () => {
    clear();
    if (client) {
      incrementId();
      try {
        const result = await client.request(json.method, json.params);
        setResults({ jsonrpc: "2.0", result, id });
      } catch (e) {
        setError(e);
      }
    }
  };
  function handleResponseEditorDidMount(_: any, editor: any) {
    editorRef.current = editor;
  }

  const clear = () => {
    setResults(undefined);
    setError(undefined);
  };

  const handleClearButton = () => {
    clear();
  };

  const handleToggleDarkMode = () => {
    if (props.onToggleDarkMode) {
      props.onToggleDarkMode();
    }
  };

  return (
    <>
      <AppBar elevation={0} position="static">
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
          {
            props.hideToggleTheme
              ? null
              : <IconButton onClick={handleToggleDarkMode}>
                {props.darkMode ? <Brightness3Icon /> : <WbSunnyIcon />}
              </IconButton>
          }
        </Toolbar>
      </AppBar>
      <SplitPane
        split="vertical"
        minSize={100}
        maxSize={-100}
        defaultSize={"50%"}
        style={{ flexGrow: 1 }}
        onChange={() => {
          if (editorRef && editorRef.current) {
            (editorRef.current as any).layout();
          }
        }}>
        <JSONRPCRequestEditor
          onChange={(val) => {
            setJson(JSON.parse(val));
          }}
          openrpcMethodObject={props.openrpcMethodObject}
          value={JSON.stringify(json, null, 4)}
        />
        <>
          {(results || error) &&
            <Button
              style={{ position: "absolute", top: "15px", right: "15px", zIndex: 1 }}
              onClick={handleClearButton}>
              Clear
                </Button>
          }
          <MonacoEditor
            options={{
              minimap: {
                enabled: false,
              },
              wordWrap: "on",
              lineNumbers: "off",
              wrappingIndent: "deepIndent",
              readOnly: true,
              showFoldingControls: "always",
            }}
            height="93vh"
            editorDidMount={handleResponseEditorDidMount}
            language="json"
            value={JSON.stringify(errorToJSON(error) || results, null, 4) || ""}
          />
        </>
      </SplitPane>
    </>
  );
};

export default Inspector;
