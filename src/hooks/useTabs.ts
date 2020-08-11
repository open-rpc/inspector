import { useState, Dispatch, useEffect } from "react";
import { OpenrpcDocument } from "@open-rpc/meta-schema";
import { JSONRPCLog } from "@open-rpc/logs-react";

interface ITab {
  name: string;
  content?: any;
  logs: JSONRPCLog[];
  editing?: boolean;
  url?: string;
  openrpcDocument?: OpenrpcDocument;
}

const emptyJSONRPC = {
  jsonrpc: "2.0",
  method: "",
  params: [],
  id: 0,
};

const useTabs = (defaultTabs?: ITab[]) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [tabs, setTabs]: [ITab[], Dispatch<any>] = useState(
    defaultTabs || [{ name: "New Tab", content: emptyJSONRPC, url: undefined, logs: [] }],
  );

  const handleClose = (event: React.MouseEvent<{}>, index: number) => {
    if (tabs.length === 1) {
      return;
    }
    const t = tabs.filter((tab, i) => i !== index);
    setTabs(t);
  };

  useEffect(() => {
    if (tabs.length === tabIndex) {
      setTabIndex(tabIndex - 1);
    }
  }, [tabs, tabIndex]);

  const setTabName = (tab: ITab, name: string) => {
    const newTabs = tabs.map((innerTab) => {
      if (innerTab === tab) {
        return {
          ...innerTab,
          name,
        };
      }
      return innerTab;
    });
    setTabs(newTabs);
  };

  const setTabEditing = (tab: ITab, editing: boolean) => {
    const newTabs = tabs.map((innerTab) => {
      if (innerTab === tab) {
        return {
          ...innerTab,
          editing,
        };
      }
      return innerTab;
    });
    setTabs(newTabs);
  };

  const setTabOpenRPCDocument = (ti: number, openrpcDocument: OpenrpcDocument | undefined) => {
    const newTabs = tabs.map((innerTab, i) => {
      if (i === ti) {
        if (!openrpcDocument) {
          return {
            name: innerTab.name,
            content: innerTab.content,
            logs: innerTab.logs,
            editing: innerTab.editing,
            url: innerTab.url,
          };
        }
        return {
          ...innerTab,
          openrpcDocument,
        };
      }
      return innerTab;
    });
    setTabs(newTabs);
  };

  const setTabUrl = (ti: number, url: string) => {
    const newTabs = tabs.map((innerTab, i) => {
      if (i === ti) {
        return {
          ...innerTab,
          url,
        };
      }
      return innerTab;
    });
    setTabs(newTabs);
  };

  const setTabLogs = (ti: number, logs: JSONRPCLog[]) => {
    const newTabs = tabs.map((innerTab, i) => {
      if (i === ti) {
        return {
          ...innerTab,
          logs,
        };
      }
      return innerTab;
    });
    setTabs(newTabs);
  };

  const setTabContent = (ti: number, content: any) => {
    const newTabs = tabs.map((innerTab, i) => {
      if (i === ti) {
        return {
          ...innerTab,
          content,
        };
      }
      return innerTab;
    });
    setTabs(newTabs);
  };

  const handleLabelChange = (ev: any, tab: ITab) => {
    setTabName(tab, ev.target.value);
  };
  return {
    setTabContent,
    setTabEditing,
    setTabIndex,
    setTabName,
    tabs,
    setTabs,
    handleClose,
    tabIndex,
    handleLabelChange,
    setTabUrl,
    setTabLogs,
    setTabOpenRPCDocument,
  };
};

export default useTabs;
