import React, { useState, useRef, useEffect, RefObject } from "react";
import MonacoContainer from "./MonacoContainer";
import * as monaco from "monaco-editor";

interface IProps {
  value: string;
  language: string;
  editorDidMount: (editor: any, ref: React.RefObject<any>) => any;
  onChange?: (ev: any, value: string) => any;
  options?: any;
  line?: number;
  loading?: Element | string;
  width?: string | number;
  height?: string | number;
  controlled?: boolean;
}

const MonacoEditor: React.FC<IProps> =
  ({ width, height, loading, value, language, options, editorDidMount, onChange, controlled }) => {
    const [isEditorReady, setIsEditorReady] = useState(false);
    const previousValue = useRef(value);
    const containerRef = useRef<any>(null);
    const editorRef = useRef<any>(null);

    const createEditor = () => {
      if (!containerRef || !containerRef.current) {
        return;
      }
      editorRef.current = monaco.editor.create(containerRef.current, {
        value,
        language,
        automaticLayout: true,
        ...options,
      });
      editorDidMount(editorRef.current.getValue.bind(editorRef.current), editorRef.current);

      setIsEditorReady(true);
      editorRef.current.onDidChangeModelContent((ev: any) => {
        const currentValue = editorRef.current!.getValue();
        if ((currentValue !== previousValue.current) && !(ev.isUndoing || ev.isRedoing)) {
          previousValue.current = currentValue;
          if (onChange) {
            onChange(ev, currentValue);
          }
        }
      });
    };

    useEffect(() => {
      if (options && options.readOnly && editorRef.current) {
        editorRef.current.setValue(value);
      } else if (editorRef.current && editorRef.current.getValue() !== value) {
        editorRef.current.executeEdits("", [{
          range: editorRef.current.getModel().getFullModelRange(),
          text: value,
        }]);
      }
    }, [value]);

    useEffect(() => {
      createEditor();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <MonacoContainer
      width={width}
      height={height}
      isEditorReady={isEditorReady}
      loading={loading}
      reference={containerRef}
    />;
  };

export default MonacoEditor;
