
import { Transport } from "@open-rpc/client-js/build/transports/Transport";
import { JSONRPCRequestData, IJSONRPCData } from "@open-rpc/client-js/build/Request";
import { JSONRPCError } from "@open-rpc/client-js";

const postmessageID = "post-message-transport";

class PostMessageTransport extends Transport {
  public uri: string;
  public window: any;
  public iframe: HTMLIFrameElement;

  constructor(uri: string) {
    super();
    this.uri = uri;
    this.iframe = document.createElement("iframe");
    this.iframe.setAttribute("width", "0px");
    this.iframe.setAttribute("height", "0px");
    this.iframe.setAttribute("style", "visiblity:hidden;border:none;outline:none;");
    this.iframe.setAttribute("src", this.uri);
    this.iframe.setAttribute("id", postmessageID);
  }
  public connect(): Promise<any> {
    const urlRegex = /^(http|https):\/\/.*$/;
    return new Promise((resolve, reject) => {
      if (!urlRegex.test(this.uri)) {
        reject(new Error("Bad URI"));
      }
      this.iframe.addEventListener("load", () => {
        resolve();
      });
      const el = document.getElementById("root");
      el?.parentNode?.insertBefore(this.iframe, el);
    });
  }

  public async sendData(data: JSONRPCRequestData, timeout: number | undefined = 5000): Promise<any> {
    return new Promise((resolve, reject) => {
      this.iframe.contentWindow?.postMessage((data as IJSONRPCData).request, this.uri);
      const handleMessage = (ev: MessageEvent) => {
        if (ev.origin === window.origin) {
          return;
        }
        window.removeEventListener("message", handleMessage);
        if (ev.data.error) {
          reject(new JSONRPCError(ev.data.error.message, ev.data.error.code, ev.data.error.data));
        }
        if (ev.data.id === (data as IJSONRPCData).request.id) {
          resolve(ev.data.result);
        }
      };
      window.addEventListener("message", handleMessage, false);
    });
  }

  public close(): void {
    const el = document.getElementById(postmessageID);
    el?.remove();
  }
}

export default PostMessageTransport;
