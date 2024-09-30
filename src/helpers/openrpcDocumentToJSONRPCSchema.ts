import { MethodObject, ContentDescriptorObject, OpenrpcDocument, ExampleObject } from "@open-rpc/meta-schema";

const schema: any = {
  type: "object",
  properties: {
    jsonrpc: {
      type: "string",
      enum: ["2.0"],
      description: "JSON-RPC version string",
    },
    id: {
      description: "unique identifier for the JSON-RPC request",
      oneOf: [
        {
          type: "string",
        },
        {
          type: "number",
        },
      ],
    },
    method: {
      type: "string",
    },
  },
};

const openrpcDocumentToJSONRPCSchema = (openrpcDocument: OpenrpcDocument) => {
  return {
    type: "object",
    properties: {
      id: {
        ...schema.properties.id,
      },
      jsonrpc: {
        ...schema.properties.jsonrpc,
      },
      method: {
        type: "string",
        oneOf: openrpcDocument && openrpcDocument.methods && openrpcDocument.methods.map((method) => {
          const m = method as MethodObject;
          return {
            const: m.name,
            description: m.description || m.summary,
            markdownDescription: m.description || m.summary,
          };
        }),
      },
    },
    allOf: openrpcDocument && openrpcDocument.methods && openrpcDocument.methods.map((method) => {
      const m = method as MethodObject;
      return {
        if: {
          properties: {
            method: {
              const: m.name,
            },
          },
        },
        then: {
          properties: {
            params: {
              oneOf: [
                {
                  type: "array",
                  minItems: m.params && m.params.filter((param: any) => param.required).length,
                  maxItems: m.params && m.params.length,
                  defaultSnippets: m.examples ? m.examples.map((example: any) => {
                    return {
                      label: example.name,
                      description: example.description || example.summary,
                      body: example.params && example.params.map((ex: ExampleObject) => ex.value),
                    };
                  }) : [],
                  items: m.params && m.params.map((param: any) => {
                    return {
                      ...param.schema,
                      markdownDescription: param.description || param.summary,
                      description: param.description || param.summary,
                      additionalProperties: false,
                    };
                  }),
                },
                {
                  type: "object",
                  properties: m.params && (m.params as ContentDescriptorObject[])
                    .reduce((memo: any, param: ContentDescriptorObject) => {
                      if (typeof param.schema === "object") {
                        memo[param.name] = {
                          ...param.schema,
                          markdownDescription: param.description || param.summary,
                          description: param.description || param.summary,
                          additionalProperties: false,
                        };
                      } else {
                        memo[param.name] = param.schema;
                      }
                      return memo;
                    }, {}),
                },
              ],
            },
          },
        },
      };
    }),
  };
};

export default openrpcDocumentToJSONRPCSchema;
