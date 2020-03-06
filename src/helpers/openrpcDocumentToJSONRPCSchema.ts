import { MethodObject, ContentDescriptorObject, OpenrpcDocument, ExampleObject } from "@open-rpc/meta-schema";

const schema: any = {
  type: "object",
  properties: {
    jsonrpc: {
      type: "string",
      enum: ["2.0"],
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
        oneOf: openrpcDocument.methods.map((method) => {
          return {
            const: method.name,
            markdownDescription: method.description || method.summary,
          };
        }),
      },
    },
    allOf: openrpcDocument.methods.map((method: MethodObject) => {
      return {
        if: {
          properties: {
            method: {
              const: method.name,
            },
          },
        },
        then: {
          properties: {
            params: {
              oneOf: [
                {
                  type: "array",
                  minItems: method.params.filter((param: any) => param.required).length,
                  maxItems: method.params.length,
                  defaultSnippets: method.examples ? method.examples.map((example: any) => {
                    return {
                      label: example.name,
                      description: example.description,
                      body: example.params.map((ex: ExampleObject) => ex.value),
                    };
                  }) : [],
                  items: method.params.map((param: any) => {
                    return {
                      ...param.schema,
                      markdownDescription: param.description,
                      additionalProperties: false,
                    };
                  }),
                },
                {
                  type: "object",
                  properties: (method.params as ContentDescriptorObject[])
                    .reduce((memo: any, param: ContentDescriptorObject) => {
                      memo[param.name] = {
                        ...param.schema,
                        markdownDescription: param.description,
                        additionalProperties: false,
                      };
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
