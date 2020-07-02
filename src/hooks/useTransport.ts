
import { JSONRPCError } from "@open-rpc/client-js/build/Error";
import { Dispatch, useEffect, useState } from "react";
import { HTTPTransport, WebSocketTransport, PostMessageWindowTransport, PostMessageIframeTransport } from "@open-rpc/client-js";
import { Transport } from "@open-rpc/client-js/build/transports/Transport";
import { IJSONRPCData } from "@open-rpc/client-js/build/Request";

type TTransport = "http" | "websocket" | "postmessagewindow" | "postmessageiframe";

export interface IWebTransport {
  type: TTransport;
  name?: string;
}

export interface IPluginTransport {
  type: "plugin";
  uri: string;
  name: string;
  transport: ITransport;
}
const getTransportFromType = async (
  uri: string,
  transports: ITransport[],
  transport: ITransport,
): Promise<Transport> => {
  let localTransport: any;
  const localTransportType = transports.find((value) => {
    return value.type === transport.type;
  });
  if (localTransportType?.type === "websocket") {
    localTransport = new WebSocketTransport(uri);
  } else if (localTransportType?.type === "http") {
    localTransport = new HTTPTransport(uri);
  } else if (localTransportType?.type === "postmessageiframe") {
    localTransport = new PostMessageIframeTransport(uri);
  } else if (localTransportType?.type === "postmessagewindow") {
    localTransport = new PostMessageWindowTransport(uri);
  } else if (localTransportType?.type === "plugin") {
    const intermediateTransport = await getTransportFromType(
      localTransportType.uri,
      transports,
      localTransportType.transport,
    );
    class InterTransport extends Transport {
      public async connect() {
        await intermediateTransport.connect();
        const results = await intermediateTransport.sendData({
          internalID: 0,
          request: {
            jsonrpc: "2.0",
            method: "connect",
            params: [uri],
            id: 0,
          },
        });
        return results;
      }
      public sendData(data: IJSONRPCData): Promise<any> {
        return intermediateTransport.sendData({
          internalID: 0,
          request: {
            jsonrpc: "2.0",
            method: "sendData",
            params: [data.request],
            id: 0,
          },
        });
      }
      public close() {
        return intermediateTransport.sendData({
          internalID: 0,
          request: {
            jsonrpc: "2.0",
            method: "close",
            params: [],
            id: 0,
          },
        });
      }
    }
    localTransport = new InterTransport();
  }

  return localTransport;
};

export type ITransport = IWebTransport | IPluginTransport;

type TUseTransport = (transports: ITransport[], url: string, defaultTransportType: ITransport) =>
  [Transport | undefined, (t: ITransport) => void, JSONRPCError | undefined, boolean];

const useTransport: TUseTransport = (transports, url, defaultTransportType) => {
  const [transport, setTransport] = useState<Transport>();
  const [transportConnected, setTransportConnected] = useState<boolean>(false);
  const [transportType, setTransportType]:
    [ITransport | undefined, Dispatch<ITransport>] = useState(defaultTransportType);
  const [error, setError]: [JSONRPCError | undefined, Dispatch<JSONRPCError | undefined>] = useState();
  useEffect(() => {
    if (url === "" || url === undefined) {
      setTransport(undefined);
      return;
    }
    if (!transportType) {
      return;
    }
    const doSetTransport = async () => {
      const localTransport = await getTransportFromType(url, transports, transportType);
      return localTransport.connect().then(() => {
        setTransportConnected(true);
        setTransport(localTransport);
      });
    };

    doSetTransport()
      .catch((e: JSONRPCError) => {
        setTransportConnected(false);
        setTransport(undefined);
        setError(e);
      });
  }, [transportType, url, transports]);
  const setSelectedTransportType = async (t: ITransport) => {
    setTransportConnected(false);
    setTransportType(t);
  };
  return [transport, setSelectedTransportType, error, transportConnected];
};

export default useTransport;
