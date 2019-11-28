import React from "react";
import useDarkMode from "use-dark-mode";
import { monaco, ControlledEditor, Monaco } from "@monaco-editor/react";
import { MethodObject } from "@open-rpc/meta-schema";

interface IProps {
  onChange?: (newValue: any) => void;
  openrpcMethodObject?: MethodObject;
  value: any;
}

const JSONRPCRequest: React.FC<IProps> = (props) => {
  const darkMode = useDarkMode();
  monaco
    .init()
    .then((m: Monaco) => {
      const modelUri = m.Uri.parse(`inmemory:/${Math.random()}/model/userSpec.json`);
      let schema: any = {
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
          params: {
            type: "array",
          },
        },
      };
      if (props.openrpcMethodObject) {
        schema = {
          ...schema,
          additionalProperties: false,
          properties: {
            ...schema.properties,
            method: {
              type: "string",
              enum: [props.openrpcMethodObject.name],
            },
            params: {
              ...schema.properties.params,
              items: props.openrpcMethodObject.params.map((param: any) => {
                return {
                  ...param.schema,
                  additionalProperties: false,
                };
              }),
            },
          },
        };
      }
      m.languages.json.jsonDefaults.setDiagnosticsOptions({
        enableSchemaRequest: true,
        schemas: [
          {
            fileMatch: ["*"],
            schema,
            uri: modelUri.toString(),
          },
        ],
        validate: true,
      });
      window.addEventListener("resize", m.editor.layout());
    })
    .catch((error: Error) => console.error("An error occurred during initialization of Monaco: ", error));

  const handleChange = (ev: any, value: any) => {
    if (props.onChange) {
      props.onChange(value);
    }
  };

  return (
    <>
      <ControlledEditor
        theme={darkMode.value ? "dark" : "light"}
        value={props.value}
        language="json"
        onChange={handleChange}
      />
    </>
  );
};

export default JSONRPCRequest;
