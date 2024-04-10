import React, { useState, useEffect, ChangeEvent, Dispatch } from "react";
import SplitPane from "react-split-pane";
import JSONRPCRequestEditor from "./JSONRPCRequestEditor";
import PlayCircle from "@material-ui/icons/PlayCircleFilled";
import CloseIcon from "@material-ui/icons/Close";
import FlashOn from "@material-ui/icons/FlashOn";
import FlashOff from "@material-ui/icons/FlashOff";
import History from "@material-ui/icons/History";
import Keyboard from "@material-ui/icons/Keyboard";
import MonacoEditor from "@etclabscore/react-monaco-editor";
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
import createPersistedState from "use-persisted-state";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import { JSONRPCError } from "@open-rpc/client-js/build/Error";
import { OpenrpcDocument, ExampleObject } from "@open-rpc/meta-schema";
import useTabs from "../hooks/useTabs";
import { useDebounce } from "use-debounce";
import { green } from "@material-ui/core/colors";
import TransportDropdown from "../components/TransportDropdown";
import useTransport, { ITransport, IWebTransport, TTransport } from "../hooks/useTransport";
import JSONRPCLogger, { JSONRPCLog } from "@open-rpc/logs-react";
import OptionsEditor from "./OptionsEditor";

const useCustomTransportList = createPersistedState("inspector-custom-transports");

const defaultTransports: ITransport[] = [
  {
    type: "http",
    name: "HTTP",
    schema: {
      type: "object",
      properties: {
        headers: {
          patternProperties: {
            "": {
              type: "string",
            },
          },
        },
        credentials: {
          type: "string",
          enum: [
            "omit",
            "same-origin",
            "include",
          ],
        },
      },
      examples: [
        {
          headers: {
          },
        },
      ],
    },
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

const errorToJSON = (error: JSONRPCError | any, id?: string | number | null): any => {
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
  customTransport?: ITransport;
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
    setTabLogs,
  } = useTabs(
    [
      {
        name: props.request ? props.request.method : "New Tab",
        content: props.request || { ...emptyJSONRPC },
        logs: [],
        url: props.url || "",
        openrpcDocument: props.openrpcDocument,
      },
    ],
  );
  const [openrpcDocument, setOpenRpcDocument] = useState(props.openrpcDocument);
  const [json, setJson] = useState(props.request || {
    jsonrpc: "2.0",
    method: "",
    params: [],
    id: 0,
  });
  const [transportList, setTransportList] = useCustomTransportList(() => {
    if (props.customTransport) {
      return [...defaultTransports, props.customTransport];
    }
    return defaultTransports;
  });
  const [url, setUrl] = useState(props.url || "");
  const [debouncedUrl] = useDebounce(url, 1000);
  const [selectedTransport, setSelectedTransport] = useState(props.customTransport || defaultTransports[0]);
  const [transportOptions, setTransportOptions] = useState<any>();
  const [debouncedtransportOptions] = useDebounce(transportOptions, 1000);
  const [transport, setTransport, , connected] = useTransport(
    transportList,
    debouncedUrl,
    props.customTransport || defaultTransports[0],
    debouncedtransportOptions,
  );
  const [historyOpen, setHistoryOpen] = useState(false);
  const [requestHistory, setRequestHistory]: [any[], Dispatch<any>] = useState([]);
  const [historySelectedIndex, setHistorySelectedIndex] = useState(0);
  const [logs, setLogs] = useState<JSONRPCLog[]>([]);
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
      setTransport(selectedTransport);
      const s: IWebTransport = selectedTransport as IWebTransport;
      if (s.schema !== undefined && s.schema !== true && s.schema !== false) {
        setTransportOptions((s.schema.examples as ExampleObject[])[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTransport]);

  useEffect(() => {
    if (json) {
      setTabContent(tabIndex, json);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [json]);

  useEffect(() => {
    if (props.transport) {
      const t = transportList
        .find((tp: ITransport) => tp.name?.toLowerCase() === props.transport?.toLowerCase());
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
    let requestTimestamp = new Date();
    if (transport) {
      try {
        requestTimestamp = new Date();
        const result = await transport.sendData({
          internalID: json.id,
          request: json,
        });
        const responseTimestamp = new Date();
        const r = { jsonrpc: "2.0", result, id: json.id };
        const reqObj: JSONRPCLog = {
          type: "request",
          method: json.method,
          timestamp: requestTimestamp,
          payload: json,
        };
        const resObj: JSONRPCLog = {
          type: "response",
          method: json.method,
          timestamp: responseTimestamp,
          payload: r,
        };
        const newHistory: any = [...requestHistory, { ...tabs[tabIndex] }];
        setRequestHistory(newHistory);
        setLogs((prevLogs) => [...prevLogs, reqObj, resObj]);
        setTabLogs(tabIndex, [...(tabs[tabIndex].logs || []), reqObj, resObj]);
      } catch (e) {
        const responseTimestamp = new Date();
        const convertedError = errorToJSON(e, json.id);
        const reqObj: JSONRPCLog = {
          type: "request",
          method: json.method,
          timestamp: requestTimestamp,
          payload: json,
        };
        const resObj: JSONRPCLog = {
          type: "response",
          method: json.method,
          timestamp: responseTimestamp,
          payload: convertedError,
        };
        const newHistory: any = [...requestHistory, { ...tabs[tabIndex] }];
        setRequestHistory(newHistory);
        setLogs((prevLogs) => [...prevLogs, reqObj, resObj]);
        setTabLogs(tabIndex, [...(tabs[tabIndex].logs || []), reqObj, resObj]);
      }
    }
  };

  const clear = () => {
    setLogs([]);
    setTabLogs(tabIndex, []);
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
      console.log("discovered: "+JSON.stringify(d))
      const doc = d as OpenrpcDocument
      setOpenRpcDocument(doc);
      setTabOpenRPCDocument(tabIndex, doc);
    } catch (e) {
      console.log("disovery error "+e)
      if (!props.openrpcDocument) {
        setOpenRpcDocument(undefined);
        setTabOpenRPCDocument(tabIndex, undefined);
      }
    }
    if (transport) {
      transport.subscribe("notification", (notification: any) => {
        const responseTimestamp = new Date();
        const notificationObj: JSONRPCLog = {
          type: "response",
          notification: true,
          method: notification.method,
          timestamp: responseTimestamp,
          payload: notification,
        };
        setLogs((prevLogs) => [...prevLogs, notificationObj]);
        setTabLogs(tabIndex, [...(tabs[tabIndex].logs || []), notificationObj]);
      });
      transport.subscribe("error", (error: any) => {
        const responseTimestamp = new Date();
        const notificationObj: JSONRPCLog = {
          type: "response",
          method: "",
          timestamp: responseTimestamp,
          payload: errorToJSON(error, null),
        };
        setLogs((prevLogs) => [...prevLogs, notificationObj]);
        setTabLogs(tabIndex, [...(tabs[tabIndex].logs || []), notificationObj]);
      });
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
      setLogs(tabs[tabIndex].logs || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabIndex]);

  useEffect(() => {
    setOpenRpcDocument(props.openrpcDocument);
    setTabOpenRPCDocument(tabIndex, props.openrpcDocument);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.openrpcDocument]);

  useEffect(() => {
    if (!historyOpen) {
      handlePlayButton();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyOpen]);

  const handleTabIndexChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  const onHistoryPlayClick = () => {
    if (requestHistory[historySelectedIndex]) {
      setJson(requestHistory[historySelectedIndex].content);
      setUrl(requestHistory[historySelectedIndex].url);
      setOpenRpcDocument(requestHistory[historySelectedIndex].openrpcDocument);
      setHistoryOpen(false);
    }
  };

  const handleTransportOptionsChange = (optionsString: string) => {
    try {
      setTransportOptions(JSON.parse(optionsString));
    } catch (e) {
      // cannot parse transport options
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
                  logs: [],
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
        pane2Style={{ height: "100%", width: "100%", overflow: "auto" }}
        style={{ flexGrow: 1, height: "calc(100% - 128px)" }}>
        <SplitPane
          split="horizontal"
          minSize={100}
          maxSize={-100}
          defaultSize={(selectedTransport as IWebTransport).schema ? "85%" : "100%"}
          pane2Style={{ height: "100%", width: "100%", overflow: "auto" }}
          style={{ flexGrow: 1, height: "calc(100% - 128px)" }}>
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
          {(selectedTransport as IWebTransport).schema && <OptionsEditor
            schema={(selectedTransport as IWebTransport).schema}
            value={JSON.stringify(transportOptions, null, 4)}
            onChange={handleTransportOptionsChange}>
          </OptionsEditor>
          }
        </SplitPane>
        <>
          {logs.length > 0 &&
            <Button
              variant="contained"
              style={{
                cursor: "pointer",
                position: "absolute",
                top: "5px",
                right: "50px",
                zIndex: 2,
                background: "rgba(255,255,255,0.2)"
              }}
              onClick={handleClearButton}>
              Clear
            </Button>
          }
          {logs.length === 0 &&
            <Container maxWidth="sm">
              <Grid container justify="center" style={{ paddingTop: "40px" }}>
                <Typography gutterBottom>Press the Play button to see the results here.</Typography>
                <Typography>
                  Use&nbsp;
                  <Button
                    startIcon={<Keyboard />}
                    variant="contained"
                    disabled
                    size="small"
                    style={{ marginRight: "3px" }}
                  >
                    CTRL + SPACE
                   </Button>
                  to auto-complete in the editor.
            </Typography>
              </Grid>
            </Container>
          }
          {logs.length !== 0 &&
            <div style={{ height: "100%" }}>
              <JSONRPCLogger
                sidebarOpen={false}
                openrpcDocument={openrpcDocument}
                logs={logs}
                sidebarAlign={"right"}
                openRecentPayload={true} />
            </div>
          }
        </>
      </SplitPane>
    </>
  );
};

export default Inspector;
