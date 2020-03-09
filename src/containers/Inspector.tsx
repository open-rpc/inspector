import React, { useState, useEffect, ChangeEvent, Dispatch } from "react";
import SplitPane from "react-split-pane";
import JSONRPCRequestEditor from "./JSONRPCRequestEditor";
import PlayCircle from "@material-ui/icons/PlayCircleFilled";
import CloseIcon from "@material-ui/icons/Close";
import History from "@material-ui/icons/History";
import PlusIcon from "@material-ui/icons/Add";
import CheckCircle from "@material-ui/icons/CheckCircle";
import {
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Button,
  InputBase,
  Tab,
  Tabs,
  Tooltip,
  Grid,
  Dialog,
  ListItem,
  List,
  ListItemText,
  Container,
} from "@material-ui/core";
import { Client, RequestManager, HTTPTransport, WebSocketTransport } from "@open-rpc/client-js";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import { JSONRPCError } from "@open-rpc/client-js/build/Error";
import { MethodObject } from "@open-rpc/meta-schema";
import MonacoEditor from "@etclabscore/react-monaco-editor";
import useTabs from "../hooks/useTabs";
import { useDebounce } from "use-debounce";
import { green } from "@material-ui/core/colors";
import { parseOpenRPCDocument } from "@open-rpc/schema-utils-js";
import useMonacoVimMode from "../hooks/useMonacoVimMode";

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
  } = useTabs(
    [
      {
        name: "New Tab",
        content: props.request || { ...emptyJSONRPC },
        url: props.url || "",
      },
    ],
  );
  const [id, incrementId] = useCounter(0);
  const [responseEditor, setResponseEditor] = useState();
  useMonacoVimMode(responseEditor);
  const [openrpcDocument, setOpenRpcDocument] = useState();
  const [json, setJson] = useState(props.request || {
    jsonrpc: "2.0",
    method: "",
    params: [],
    id,
  });
  const [results, setResults] = useState();
  const [url, setUrl] = useState(props.url || "");
  const [debouncedUrl] = useDebounce(url, 1000);
  const [client, error] = useClient(debouncedUrl);
  const [historyOpen, setHistoryOpen] = useState();
  const [requestHistory, setRequestHistory]: [any[], Dispatch<any>] = useState([]);
  const [historySelectedIndex, setHistorySelectedIndex] = useState(0);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [json]);

  useEffect(() => {
    if (props.url) {
      setUrl(props.url);
      setTabUrl(tabIndex, props.url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        const newHistory: any = [...requestHistory, { ...tabs[tabIndex] }];
        setRequestHistory(newHistory);
      } catch (e) {
        const newHistory: any = [...requestHistory, { ...tabs[tabIndex] }];
        setRequestHistory(newHistory);
        setResults(e);
        setTabResults(tabIndex, e);
      }
    }
  };
  function handleResponseEditorDidMount(__: any, editor: any) {
    setResponseEditor(editor);
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
        const doc = await parseOpenRPCDocument(d);
        setOpenRpcDocument(doc);
        setTabOpenRPCDocument(tabIndex, doc);
      } catch (e) {
        setOpenRpcDocument(undefined);
        setTabOpenRPCDocument(tabIndex, undefined);
      }
    }
  };
  useEffect(() => {
    refreshOpenRpcDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  useEffect(() => {
    if (tabs[tabIndex]) {
      setJson(tabs[tabIndex].content);
      setUrl(tabs[tabIndex].url || "");
      setOpenRpcDocument(tabs[tabIndex].openrpcDocument);
      setResults(tabs[tabIndex].results);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabIndex]);

  const handleTabIndexChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  const onHistoryPlayClick = () => {
    if (requestHistory[historySelectedIndex]) {
      setJson(requestHistory[historySelectedIndex].content);
      setUrl(requestHistory[historySelectedIndex].url);
      setOpenRpcDocument(requestHistory[historySelectedIndex].openrpcDocument);
      setResults(undefined);
      setHistoryOpen(false);
    }
  };

  return (
    <>
      <Dialog onClose={() => setHistoryOpen(false)} aria-labelledby="simple-dialog-title" open={historyOpen} >
        <Container maxWidth="sm">
          <Grid
            container
            justify="space-between"
            alignItems="center"
            style={{ padding: "30px", paddingTop: "10px", paddingBottom: "10px" }}>
            <Typography color="textPrimary">History</Typography>
            {
              requestHistory.length === 0
                ? null
                : <Tooltip title="Use">
                  <IconButton onClick={onHistoryPlayClick}>
                    <PlayCircle />
                  </IconButton>
                </Tooltip>
            }
          </Grid>
          {
            requestHistory.length === 0
              ? <Typography style={{ padding: "30px" }}>No History Yet.</Typography>
              : <Grid container style={{ paddingBottom: "30px" }}>
                <List style={{ padding: "10px", overflowY: "scroll", height: "250px", width: "200px" }}>
                  {requestHistory.map((requestHistoryItem: any, historyIndex: number) => (
                    <ListItem button
                      onClick={() => setHistorySelectedIndex(historyIndex)}
                      selected={historyIndex === historySelectedIndex}>
                      <ListItemText
                        primary={requestHistoryItem.content.method || "Empty Method"}
                        secondary={requestHistoryItem.url || "Empty Url"}
                      />
                    </ListItem>
                  ))}
                </List>
                <MonacoEditor
                  width="300px"
                  height="250px"
                  value={
                    requestHistory[historySelectedIndex]
                      ? JSON.stringify(requestHistory[historySelectedIndex].content, null, 4)
                      : ""
                  }
                  language="json"
                  editorDidMount={() => {
                    // noop
                  }}
                />
              </Grid>
          }
        </Container>
      </Dialog>

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
                  <Tooltip title="Close Tab">
                    <IconButton onClick={
                      (ev) => handleClose(ev, index)
                    } style={{ position: "absolute", right: "10px", top: "25%" }} size="small">
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                  : null
                }
              </div>
            }></Tab>
          ))}
          <Tab disableRipple style={{ minWidth: "50px" }} label={
            <Tooltip title="Create New Tab">
              <IconButton onClick={() => setTabs([
                ...tabs,
                {
                  name: "New Tab",
                  content: { ...emptyJSONRPC },
                  url: "",
                },
              ],
              )}>
                <PlusIcon scale={0.5} />
              </IconButton>
            </Tooltip>
          }>
          </Tab>
        </Tabs>
      </div>
      <AppBar elevation={0} position="static" style={{ zIndex: 1 }}>
        <Toolbar>
          <img
            height="30"
            alt="openrpc-logo"
            style={{ marginRight: "10px" }}
            src="https://github.com/open-rpc/design/raw/master/icons/open-rpc-logo-noText/open-rpc-logo-noText%20(PNG)/128x128.png" //tslint:disable-line
          />
          <Typography variant="h6" color="textSecondary">Inspector</Typography>
          <Tooltip title="Play">
            <IconButton onClick={handlePlayButton}>
              <PlayCircle />
            </IconButton>
          </Tooltip>
          <InputBase
            startAdornment={openrpcDocument
              ?
              <Tooltip title={
                <div style={{ textAlign: "center" }}>
                  <Typography>Valid OpenRPC Endpoint.</Typography>
                  <Typography variant="caption">
                    The JSON-RPC endpoint responds to the rpc.discover method.
                    This adds features like auto completion to the inspector.
                    </Typography>
                </div>
              } onClick={() => window.open("https://spec.open-rpc.org/#service-discovery-method")}>
                <CheckCircle style={{ color: green[500], marginRight: "5px", cursor: "pointer" }} scale={0.1} />
              </Tooltip>
              : null
            }
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
          <Tooltip title="History">
            <IconButton onClick={() => setHistoryOpen(true)}>
              <History />
            </IconButton>
          </Tooltip>
          {
            props.hideToggleTheme
              ? null
              :
              <Tooltip title="Toggle Theme">
                <IconButton onClick={handleToggleDarkMode}>
                  {props.darkMode ? <Brightness3Icon /> : <WbSunnyIcon />}
                </IconButton>
              </Tooltip>
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
          if (responseEditor) {
            responseEditor.layout();
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
          {results
            ?
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
            : <Grid container justify="center" style={{ paddingTop: "20px" }} direction="column" alignItems="center">
              <Typography variant="body1" gutterBottom color="textSecondary">Press the Play button to see the results here.</Typography>
              <Typography variant="body1" color="textSecondary">
                Use <Button variant="contained" disabled size="small" style={{ marginRight: "3px" }}>CTRL + SPACE</Button>
                to auto-complete in the editor.
              </Typography>
            </Grid>
          }
        </>
      </SplitPane>
    </>
  );
};

export default Inspector;
