import React from "react";
import useDarkMode from "use-dark-mode";
import { monaco, ControlledEditor, Monaco } from "@monaco-editor/react";

interface IProps {
  onChange?: (newValue: any) => void;
  value: any;
}
monaco
  .init()
  .then((m: Monaco) => {
    const modelUri = m.Uri.parse(`inmemory:/${Math.random()}/model/userSpec.json`);
    m.languages.json.jsonDefaults.setDiagnosticsOptions({
      enableSchemaRequest: true,
      schemas: [
        {
          fileMatch: ["*"],
          schema: {
            type: "object",
            properties: {
              method: {
                type: "string",
              },
              params: {
                type: "array",
              },
            },
          },
          uri: modelUri.toString(),
        },
      ],
      validate: true,
    });
    window.addEventListener("resize", m.editor.layout());
  })
  .catch((error: Error) => console.error("An error occurred during initialization of Monaco: ", error));

const JSONRPCRequest: React.FC<IProps> = (props) => {
  const darkMode = useDarkMode();

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
