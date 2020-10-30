import React, { useEffect, useState } from "react";
import MonacoEditor from "@etclabscore/react-monaco-editor";
import * as monaco from "monaco-editor";
import { JSONSchema, MethodObject } from "@open-rpc/meta-schema";
import useWindowSize from "@rehooks/window-size";
import { addDiagnostics } from "@etclabscore/monaco-add-json-schema-diagnostics";
import useMonacoVimMode from "../hooks/useMonacoVimMode";

interface IProps {
  onChange?: (newValue: any) => void;
  openrpcMethodObject?: MethodObject;
  schema?: JSONSchema;
  value: any;
}

const OptionsEditor: React.FC<IProps> = (props) => {
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
    const modelName = "inspector-transport-options";
    const modelUriString = `inmemory://${modelName}-${Math.random()}.json`;
    const modelUri = monaco.Uri.parse(modelUriString);
    const model = monaco.editor.createModel(props.value || "", "json", modelUri);
    editor.setModel(model);

    addDiagnostics(modelUri.toString(), props.schema, monaco);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.schema, editor]);

  function handleEditorDidMount(_: any, ed: any) {
    setEditor(ed);
  }

  const handleChange = (ev: any, value: any) => {
    if (props.onChange) {
      props.onChange(value);
    }
  };

  return (
    <>
      <div style={{ marginTop: "5px", background: "black" }}></div>
      <MonacoEditor
        height="95%"
        width="100%"
        value={props.value}
        editorDidMount={handleEditorDidMount}
        editorOptions={{
          minimap: {
            enabled: false,
          },
          lineNumbers: "off",
          glyphMargin: false,
          folding: false,
          automaticLayout: true,
          fixedOverflowWidgets: true,
        }}
        language="json"
        onChange={handleChange}
      />
    </>
  );
};

export default OptionsEditor;
