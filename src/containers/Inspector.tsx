import React, { useState, useEffect, ChangeEvent, Dispatch } from "react";
import SplitPane from "react-split-pane";
import JSONRPCRequestEditor from "./JSONRPCRequestEditor";
import * as monaco from "monaco-editor";
import PlayCircle from "@material-ui/icons/PlayCircleFilled";
import CloseIcon from "@material-ui/icons/Close";
import FlashOn from "@material-ui/icons/FlashOn";
import FlashOff from "@material-ui/icons/FlashOff";
import History from "@material-ui/icons/History";
import PlusIcon from "@material-ui/icons/Add";
import DocumentIcon from "@material-ui/icons/Description";
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
import Brightness3Icon from "@material-ui/icons/Brightness3";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import { JSONRPCError } from "@open-rpc/client-js/build/Error";
import { OpenrpcDocument } from "@open-rpc/meta-schema";
import MonacoEditor from "@etclabscore/react-monaco-editor";
import useTabs from "../hooks/useTabs";
import { useDebounce } from "use-debounce";
import { green } from "@material-ui/core/colors";
import { parseOpenRPCDocument } from "@open-rpc/schema-utils-js";
import useMonacoVimMode from "../hooks/useMonacoVimMode";
import { addDiagnostics } from "@etclabscore/monaco-add-json-schema-diagnostics";
import openrpcDocumentToJSONRPCSchemaResult from "../helpers/openrpcDocumentToJSONRPCSchemaResult";
import TransportDropdown from "../components/TransportDropdown";
import useTransport, { ITransport, TTransport } from "../hooks/useTransport";

const defaultTransports: ITransport[] = [
  {
    type: "http",
    name: "HTTP",
  },
  {
    type: "websocket",
    name: "WebSocket",
  },
  {
    type: "postmessagewindow",
    name: "PostMessageWindow",
  },
  {
    type: "postmessageiframe",
    name: "PostMessageIframe",
  },
];

const errorToJSON = (error: JSONRPCError | any, id: string | number): any => {
  const isError = error instanceof Error;
  if (!isError) {
    return;
  }
  if (!error) {
    return;
  }
  const emptyErrorResponse = {
    jsonrpc: "2.0",
    id,
  };
  // this is an internal wrapped client-js error
  if (error.data instanceof Error) {
    return {
      ...emptyErrorResponse,
      error: {
        code: error.data.code,
        message: error.data.message,
        data: error.data.data,
      },
    };
  }
  return {
    ...emptyErrorResponse,
    error: {
      code: error.code,
      message: error.message,
      data: error.data,
    },
  };
};

interface IProps {
  url?: string;
  request?: any;
  darkMode?: boolean;
  hideToggleTheme?: boolean;
  openrpcDocument?: OpenrpcDocument;
  transport?: TTransport;
  onToggleDarkMode?: () => void;
}

const emptyJSONRPC = {
  jsonrpc: "2.0",
  method: "",
  params: [],
  id: 0,
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
        name: props.request ? props.request.method : "New Tab",
        content: props.request || { ...emptyJSONRPC },
        url: props.url || "",
        openrpcDocument: props.openrpcDocument,
      },
    ],
  );
  const [responseEditor, setResponseEditor] = useState();
  useMonacoVimMode(responseEditor);
  const [openrpcDocument, setOpenRpcDocument] = useState(props.openrpcDocument);
  const [json, setJson] = useState(props.request || {
    jsonrpc: "2.0",
    method: "",
    params: [],
    id: 0,
  });
  const [results, setResults]: [any, Dispatch<any>] = useState();
  const [transportList, setTransportList] = useState(defaultTransports);
  const [url, setUrl] = useState(props.url || "");
  const [debouncedUrl] = useDebounce(url, 1000);
  const [selectedTransport, setSelectedTransport] = useState(defaultTransports[0]);
  const [transport, setTransport, , connected] = useTransport(transportList, debouncedUrl, defaultTransports[0]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [requestHistory, setRequestHistory]: [any[], Dispatch<any>] = useState([]);
  const [historySelectedIndex, setHistorySelectedIndex] = useState(0);
  useEffect(() => {
    setTabs([
      ...tabs,
      {
        name: props.request ? props.request.method || "New Tab" : "New Tab",
        content: props.request,
        url: props.url,
        openrpcDocument,
      },
    ]);
    setTabIndex(tabs.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.request]);

  useEffect(() => {
    if (selectedTransport !== undefined) {
      setTransport(selectedTransport!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTransport]);

  useEffect(() => {
    if (!openrpcDocument) {
      return;
    }
    if (!responseEditor) {
      return;
    }
    if (!results) {
      return;
    }
    const schema = openrpcDocumentToJSONRPCSchemaResult(openrpcDocument, json.method);
    const modelName = "inspector-results";
    const modelUriString = `inmemory://${modelName}-${Math.random()}.json`;
    const modelUri = monaco.Uri.parse(modelUriString);
    const model = monaco.editor.createModel(
      results ? JSON.stringify(results, null, 4) : ""
      , "json", modelUri);
    if (responseEditor) {
      responseEditor.setModel(model);
    }
    addDiagnostics(modelUri.toString(), schema, monaco);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, responseEditor, openrpcDocument]);

  useEffect(() => {
    if (json) {
      setTabContent(tabIndex, json);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [json]);

  useEffect(() => {
    if (props.transport) {
      const t = defaultTransports
        .find((tp: ITransport) => tp.type === props.transport);
      if (t) {
        setSelectedTransport(t);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.transport]);

  useEffect(() => {
    if (props.url) {
      setUrl(props.url);
      setTabUrl(tabIndex, props.url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.url]);

  const handlePlayButton = async () => {
    clear();
    if (transport) {
      try {
        const result = await transport.sendData({
          internalID: json.id,
          request: json,
        });
        const r = { jsonrpc: "2.0", result, id: json.id };
        setResults(r);
        setTabResults(tabIndex, r);
        const newHistory: any = [...requestHistory, { ...tabs[tabIndex] }];
        setRequestHistory(newHistory);
      } catch (e) {
        const convertedError = errorToJSON(e, json.id);
        const newHistory: any = [...requestHistory, { ...tabs[tabIndex] }];
        setRequestHistory(newHistory);
        setResults(convertedError);
        setTabResults(tabIndex, convertedError);
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
    try {
      const d = await transport?.sendData({
        internalID: 999999,
        request: {
          jsonrpc: "2.0",
          params: [],
          id: 999999,
          method: "rpc.discover",
        },
      });
      const doc = await parseOpenRPCDocument(d);
      setOpenRpcDocument(doc);
      setTabOpenRPCDocument(tabIndex, doc);
    } catch (e) {
      if (!props.openrpcDocument) {
        setOpenRpcDocument(undefined);
        setTabOpenRPCDocument(tabIndex, undefined);
      }
    }
  };
  useEffect(() => {
    if (!props.openrpcDocument) {
      setOpenRpcDocument(undefined);
    }
    refreshOpenRpcDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transport, tabIndex]);

  useEffect(() => {
    if (tabs[tabIndex]) {
      setJson(tabs[tabIndex].content);
      setUrl(tabs[tabIndex].url || "");
      setResults(tabs[tabIndex].results);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabIndex]);

  useEffect(() => {
    setOpenRpcDocument(props.openrpcDocument);
    setTabOpenRPCDocument(tabIndex, props.openrpcDocument);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.openrpcDocument]);

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
                  content: { ...emptyJSONRPC, id: 0 },
                  openrpcDocument,
                  url,
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
          <TransportDropdown
            transports={transportList}
            onAddTransport={(addedTransport: ITransport) => {
              setTransportList([
                ...transportList,
                addedTransport,
              ]);
            }}
            selectedTransport={selectedTransport}
            onChange={(changedTransport) => setSelectedTransport(changedTransport)}
            style={{
              marginLeft: "10px",
            }}
          />
          <Tooltip title="Play">
            <IconButton onClick={handlePlayButton}>
              <PlayCircle fontSize="large" />
            </IconButton>
          </Tooltip>
          <InputBase
            startAdornment={
              <>
                <Tooltip title={connected ? "Connected" : "Not Connected"}>
                  {connected
                    ? <FlashOn style={{ color: green[500] }} />
                    : <FlashOff color="error" />
                  }
                </Tooltip>
                {
                  openrpcDocument
                    ?
                    <Tooltip title={
                      <div style={{ textAlign: "center" }}>
                        <Typography>OpenRPC Document Detected</Typography>
                        <Typography variant="caption">
                          A JSON-RPC endpoint may respond to the rpc.discover method
                          or a provide a static document.
                          This adds features like auto completion to the inspector.
                    </Typography>
                      </div>
                    } onClick={() => window.open("https://spec.open-rpc.org/#service-discovery-method")}>
                      <DocumentIcon style={{ color: green[500], marginRight: "5px", cursor: "pointer" }} scale={0.1} />
                    </Tooltip>
                    : null
                }
              </>
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
          value={JSON.stringify(json, null, 4)}
        />
        <>
          {results &&
            <Button
              style={{ position: "absolute", top: "15px", right: "15px", zIndex: 1 }}
              onClick={handleClearButton}>
              Clear
            </Button>
          }
          {results
            ?
            <MonacoEditor
              editorOptions={{
                minimap: {
                  enabled: false,
                },
                wordWrap: "on",
                lineNumbers: "off",
                wrappingIndent: "deepIndent",
                readOnly: true,
                showFoldingControls: "always",
                fixedOverflowWidgets: true,
                automaticLayout: true,
              }}
              height="93vh"
              editorDidMount={handleResponseEditorDidMount}
              language="json"
              value={JSON.stringify(results, null, 4) || ""}
            />
            : <Grid container justify="center" style={{ paddingTop: "20px" }} direction="column" alignItems="center">
              <Typography variant="body1" gutterBottom color="textSecondary" style={{ paddingBottom: "15px" }}>
                Press the Play button to see the results here.
                </Typography>
              <Typography variant="body1" color="textSecondary">
                Use <Button variant="contained" disabled size="small" style={{ marginRight: "3px" }}>
                  CTRL + SPACE
                </Button>
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
