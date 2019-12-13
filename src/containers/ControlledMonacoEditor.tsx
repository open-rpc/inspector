import React, { RefObject } from "react";
import MonacoEditor from "./MonacoEditor";

interface IProps {
  value: string;
  language: string;
  editorDidMount: (editor: any, ref: React.RefObject<any>) => any;
  options?: any;
  line?: number;
  loading?: Element | string;
  width?: string | number;
  height?: string | number;
  onChange: any;
}

const ControlledMonacoEditor: React.FC<IProps> = ({value, onChange, editorDidMount, ...props}) => {
  return (
    <MonacoEditor
      value={value}
      editorDidMount={editorDidMount}
      controlled={true}
      {...props}
    />
  );
};

export default ControlledMonacoEditor;
