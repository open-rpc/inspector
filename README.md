# OpenRPC Inspector

OpenRPC Inspector is a simple tool to create, modify and execute JSON-RPC requests.

- Edit JSON-RPC request
- Test JSON-RPC request against a given URL

It can be used as a standalone tool or included in other projects.

![inspector_history](https://user-images.githubusercontent.com/364566/76125093-ef2fee00-5fb0-11ea-818e-04becc063bee.gif)

https://inspector.open-rpc.org

Need help or have a question? Join us on [Discord](https://discord.gg/gREUKuF)!

### Url configuration

You can configure the default request, url and transport via url params:

`?url=http://localhost:8545`

`?request[jsonrpc]=2.0&request[method]=eth_chainId&request[id]=0`

`?transport=websocket`

here is a full example:

https://inspector.open-rpc.org/?url=https://mock.open-rpc.org/petstore-1.0.0&?request[jsonrpc]=2.0&request[method]=list_pets&request[id]=0

### Contributing

How to contribute, build and release are outlined in [CONTRIBUTING.md](CONTRIBUTING.md), [BUILDING.md](BUILDING.md) and [RELEASING.md](RELEASING.md) respectively. Commits in this repository follow the [CONVENTIONAL_COMMITS.md](CONVENTIONAL_COMMITS.md) specification.

# Resources
-  [open-rpc/client-js](https://github.com/open-rpc/client-js)
-  [open-rpc/logs-react](https://github.com/open-rpc/logs-react)
