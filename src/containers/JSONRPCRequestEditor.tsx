import React, { useEffect, useState } from "react";
import MonacoEditor from "@etclabscore/react-monaco-editor";
import * as monaco from "monaco-editor";
import { MethodObject, ContentDescriptorObject, OpenrpcDocument } from "@open-rpc/meta-schema";
import useWindowSize from "@rehooks/window-size";
import { addDiagnostics } from "@etclabscore/monaco-add-json-schema-diagnostics";
import openrpcDocumentToJSONRPCSchema from "../helpers/openrpcDocumentToJSONRPCSchema";
import useMonacoVimMode from "../hooks/useMonacoVimMode";

interface IProps {
  onChange?: (newValue: any) => void;
  openrpcMethodObject?: MethodObject;
  openrpcDocument?: OpenrpcDocument;
  value: any;
}

const JSONRPCRequestEditor: React.FC<IProps> = (props) => {
  const [editor, setEditor] = useState();
  useMonacoVimMode(editor);
  const windowSize = useWindowSize();
  useEffect(() => {
    if (editor) {
      editor.layout();
    }
  }, [windowSize, editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }
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
            oneOf: [
              {
                type: "array",
                ...schema.properties.params,
                items: props.openrpcMethodObject.params.map((param: any) => {
                  return {
                    ...param.schema,
                    additionalProperties: false,
                  };
                }),
              },
              {
                type: "object",
                properties: (props.openrpcMethodObject.params as ContentDescriptorObject[])
                  .reduce((memo: any, param: ContentDescriptorObject) => {
                    memo[param.name] = {
                      ...param.schema,
                      additionalProperties: false,
                    };
                    return memo;
                  }, {}),
              },
            ],
          },
        },
      };
    } else if (props.openrpcDocument) {
      schema = openrpcDocumentToJSONRPCSchema(props.openrpcDocument);
    } else {
      schema = {
        additionalProperties: false,
        properties: {
          ...schema.properties,
          params: {
            oneOf: [
              { type: "array" },
              { type: "object" },
            ],
          },
        },
      };
    }
    addDiagnostics(modelUri.toString(), schema, monaco);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.openrpcDocument, props.openrpcMethodObject]);

  function handleEditorDidMount(_: any, ed: any) {
    setEditor(ed);
  }

  const handleChange = (ev: any, value: any) => {
    if (props.onChange) {
      props.onChange(value);
    }
  };

  return (
    <MonacoEditor
      height="93vh"
      value={props.value}
      editorDidMount={handleEditorDidMount}
      language="json"
      onChange={handleChange}
    />
  );
};

export default JSONRPCRequestEditor;
