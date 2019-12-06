import React, { useRef, useEffect } from "react";
import useDarkMode from "use-dark-mode";
import { monaco, ControlledEditor, Monaco } from "@monaco-editor/react";
import { MethodObject } from "@open-rpc/meta-schema";
import useWindowSize from "@rehooks/window-size";
import { addDiagnostics } from "@etclabscore/monaco-add-json-schema-diagnostics";

interface IProps {
  onChange?: (newValue: any) => void;
  openrpcMethodObject?: MethodObject;
  value: any;
}

const JSONRPCRequest: React.FC<IProps> = (props) => {
  const darkMode = useDarkMode();
  const editorRef = useRef();
  const windowSize = useWindowSize();

  useEffect(() => {
    if (editorRef !== undefined && editorRef.current !== undefined) {
      (editorRef.current as any).layout();
    }
  }, [windowSize]);

  function handleEditorDidMount(_: any, editor: any) {
    editorRef.current = editor;
    const modelName = props.openrpcMethodObject ? props.openrpcMethodObject.name : "inspector";
    const modelUriString = `inmemory://${modelName}.json`;
    monaco
      .init()
      .then((m: Monaco) => {
        const modelUri = m.Uri.parse(modelUriString);
        const model = m.editor.createModel(props.value || "", "json", modelUri);
        editor.setModel(model);
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
        addDiagnostics(modelUri.toString(), schema, m);
      })
      .catch((error: Error) => console.error("An error occurred during initialization of Monaco: ", error));
  }

  const handleChange = (ev: any, value: any) => {
    if (props.onChange) {
      props.onChange(value);
    }
  };

  return (
    <>
      <ControlledEditor
        height="100vh"
        theme={darkMode.value ? "dark" : "light"}
        value={props.value}
        editorDidMount={handleEditorDidMount}
        language="json"
        onChange={handleChange}
      />
    </>
  );
};

export default JSONRPCRequest;
