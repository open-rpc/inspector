import { MethodObject, ContentDescriptorObject, OpenrpcDocument, ExampleObject, MethodObjectResult } from "@open-rpc/meta-schema";

const schema: any = {
  type: "object",
  properties: {
    jsonrpc: {
      type: "string",
      description: "JSON-RPC Version String",
      const: "2.0",
    },
    id: {
      oneOf: [
        {
          type: "string",
        },
        {
          type: "number",
        },
      ],
    },
  },
};

const openrpcDocumentToJSONRPCSchemaResult = (openrpcDocument: OpenrpcDocument, methodName: string) => {
  const methodObject: MethodObject | undefined = openrpcDocument.methods.find((method) => method.name === methodName);
  let methodSchema: any;
  if (methodObject !== undefined && methodObject.result !== undefined) {
    methodSchema = (methodObject.result as ContentDescriptorObject).schema;
  }
  return {
    type: "object",
    properties: {
      id: {
        ...schema.properties.id,
      },
      jsonrpc: {
        ...schema.properties.jsonrpc,
      },
      result: {
        ...methodSchema,
        markdownDescription: methodObject?.description || methodObject?.summary,
        description: methodObject?.description || methodObject?.summary,
      },
    },
  };
};

export default openrpcDocumentToJSONRPCSchemaResult;
