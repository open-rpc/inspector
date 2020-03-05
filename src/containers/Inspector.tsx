import React, { useState, useEffect, ChangeEvent, Dispatch, useRef } from "react";
import SplitPane from "react-split-pane";
import _ from "lodash";
import JSONRPCRequestEditor from "./JSONRPCRequestEditor";
import PlayCircle from "@material-ui/icons/PlayCircleFilled";
import CloseIcon from "@material-ui/icons/Close";
import PlusIcon from "@material-ui/icons/Add";
import { IconButton, AppBar, Toolbar, Typography, Button, InputBase, Tab, Tabs } from "@material-ui/core";
import { Client, RequestManager, HTTPTransport, WebSocketTransport } from "@open-rpc/client-js";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import { JSONRPCError } from "@open-rpc/client-js/build/Error";
import { MethodObject } from "@open-rpc/meta-schema";
import MonacoEditor from "@etclabscore/react-monaco-editor";
import useTabs from "../hooks/useTabs";
import { useDebounce } from "use-debounce";

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

const emptyJSONRPC = {
  jsonrpc: "2.0",
  method: "",
  params: [],
  id: "0",
};

const Inspector: React.FC<IProps> = (props) => {
  const {
    setTabContent,
    setTabEditing,
    setTabIndex,
    tabs,
    setTabs,
    handleClose,
    tabIndex,
    setTabOpenRPCDocument,
    setTabUrl,
    handleLabelChange,
    setTabResults,
  } = useTabs();
  const [id, incrementId] = useCounter(0);
  const [openrpcDocument, setOpenRpcDocument] = useState();
  const [json, setJson] = useState(props.request || {
    jsonrpc: "2.0",
    method: "",
    params: [],
    id,
  });
  const editorRef = useRef();
  const [results, setResults] = useState();
  const [url, setUrl] = useState(props.url || "");
  const [debouncedUrl] = useDebounce(url, 1000);
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
      const jsonResult = {
        ...json,
        jsonrpc: "2.0",
        id: id.toString(),
      };
      setJson(jsonResult);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (json) {
      setTabContent(tabIndex, json);
    }
  }, [json]);

  useEffect(() => {
    if (props.url) {
      setUrl(props.url);
      setTabUrl(tabIndex, props.url);
    }
  }, [props.url]);

  const handlePlayButton = async () => {
    clear();
    if (client) {
      incrementId();
      try {
        const result = await client.request(json.method, json.params);
        const r = { jsonrpc: "2.0", result, id };
        setResults(r);
        setTabResults(tabIndex, r);
      } catch (e) {
        setResults(e);
        setTabResults(tabIndex, e);
      }
    }
  };
  function handleResponseEditorDidMount(__: any, editor: any) {
    editorRef.current = editor;
  }

  const clear = () => {
    setResults(undefined);
    setTabResults(tabIndex, undefined);
  };

  const handleClearButton = () => {
    clear();
  };

  const handleToggleDarkMode = () => {
    if (props.onToggleDarkMode) {
      props.onToggleDarkMode();
    }
  };
  const refreshOpenRpcDocument = async () => {
    if (url) {
      try {
        const d = await client.request("rpc.discover", []);
        setOpenRpcDocument(d);
        setTabOpenRPCDocument(tabIndex, d);
      } catch (e) {
        setOpenRpcDocument(undefined);
        setTabOpenRPCDocument(tabIndex, undefined);
      }
    }
  };

  useEffect(() => {
    refreshOpenRpcDocument();
  }, [debouncedUrl]);

  useEffect(() => {
    if (tabs[tabIndex]) {
      setJson(tabs[tabIndex].content);
      setUrl(tabs[tabIndex].url || "");
      setOpenRpcDocument(tabs[tabIndex].openrpcDocument);
      setResults(tabs[tabIndex].results);
    }
  }, [tabIndex]);

  const handleTabIndexChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <div style={{ position: "relative" }}>
        <Tabs
          style={{ background: "transparent" }}
          value={tabIndex}
          variant="scrollable"
          indicatorColor="primary"
          onChange={handleTabIndexChange}
        >
          {tabs.map((tab, index) => (
            <Tab disableRipple style={{
              border: "none",
              outline: "none",
              userSelect: "none",
            }} onDoubleClick={() => setTabEditing(tab, true)} label={
              <div style={{ userSelect: "none" }}>
                {tab.editing
                  ? <InputBase
                    value={tab.name}
                    onChange={(ev) => handleLabelChange(ev, tab)}
                    onBlur={() => setTabEditing(tab, false)}
                    autoFocus
                    style={{ maxWidth: "80px", marginRight: "25px" }}
                  />
                  : <Typography style={{ display: "inline", textTransform: "none", marginRight: "25px" }} variant="body1" >{tab.name}</Typography>
                }
                {tabIndex === index
                  ?
                  <IconButton onClick={
                    (ev) => handleClose(ev, index)
                  } style={{ position: "absolute", right: "10px", top: "25%" }} size="small">
                    <CloseIcon />
                  </IconButton>
                  : null
                }
              </div>
            }></Tab>
          ))}
          <Tab disableRipple style={{ minWidth: "50px" }} label={
            <IconButton onClick={() => setTabs([...tabs, { name: "New Tab", content: { ...emptyJSONRPC }, url: "" }])}>
              <PlusIcon scale={0.5} />
            </IconButton>
          }>
          </Tab>
        </Tabs>
      </div>
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
              (event: ChangeEvent<HTMLInputElement>) => {
                setUrl(event.target.value);
                setTabUrl(tabIndex, event.target.value);
              }
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
            let jsonResult;
            try {
              jsonResult = JSON.parse(val);
            } catch (e) {
              console.error(e);
            }
            if (jsonResult) {
              setJson(jsonResult);
              setTabContent(tabIndex, jsonResult);
            }
          }}
          openrpcDocument={openrpcDocument}
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
