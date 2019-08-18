import React, { useState } from "react";
import ReactJson from "react-json-view";

interface IProps {
  json?: any;
  reactJsonTheme: string;
  onChange?: (newValue: any) => void;
}

const JSONRPCRequest: React.FC<IProps> = (props) => {
  const [reactJsonOptions] = useState({
    collapseStringsAfterLength: 25,
    displayDataTypes: false,
    displayObjectSize: false,
    indentWidth: 2,
    name: false,
  });

  const handleChange = (changed: any) => {
    if (props.onChange) {
      props.onChange(changed.updated_src);
    }
  };

  return (
    <>
      <ReactJson
        theme={props.reactJsonTheme}
        src={props.json}
        {...reactJsonOptions as any}
        onEdit={handleChange}
        onAdd={handleChange}
        onDelete={handleChange}
      />
    </>
  );
};

export default JSONRPCRequest;
