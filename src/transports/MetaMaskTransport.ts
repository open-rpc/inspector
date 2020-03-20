import { Transport } from "@open-rpc/client-js/build/transports/Transport";
import { JSONRPCRequestData, IJSONRPCData } from "@open-rpc/client-js/build/Request";

class MetaMaskTransport extends Transport {
  public uri: string;

  constructor(uri: string) {
    super();
    this.uri = uri;
  }
  public connect(): Promise<any> {
    return (window as any).ethereum.send({
      method: "wallet_enable",
      params: [{
        [this.uri]: {},
      }],
    });
  }

  public async sendData(data: JSONRPCRequestData, timeout: number | undefined = 5000): Promise<any> {
    return (window as any).ethereum.send({
      method: this.uri,
      params: [
        (data as IJSONRPCData).request,
      ],
    });
  }

  public close(): void {
    // noop
  }
}

export default MetaMaskTransport;
