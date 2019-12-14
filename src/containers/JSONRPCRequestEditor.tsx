import React, { useRef, useEffect } from "react";
import MonacoEditor from "@etclabscore/react-monaco-editor";
import * as monaco from "monaco-editor";
import { MethodObject } from "@open-rpc/meta-schema";
import useWindowSize from "@rehooks/window-size";
import { addDiagnostics } from "@etclabscore/monaco-add-json-schema-diagnostics";

interface IProps {
  onChange?: (newValue: any) => void;
  openrpcMethodObject?: MethodObject;
  value: any;
}

const JSONRPCRequestEditor: React.FC<IProps> = (props) => {
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
    const modelUriString = `inmemory://${modelName}-${Math.random()}.json`;
    const modelUri = monaco.Uri.parse(modelUriString);
    const model = monaco.editor.createModel(props.value || "", "json", modelUri);
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
    addDiagnostics(modelUri.toString(), schema, monaco);
  }

  const handleChange = (ev: any, value: any) => {
    if (props.onChange) {
      props.onChange(value);
    }
  };

  return (
    <MonacoEditor
      height="100vh"
      value={props.value}
      editorDidMount={handleEditorDidMount}
      language="json"
      onChange={handleChange}
    />
  );
};

export default JSONRPCRequestEditor;
