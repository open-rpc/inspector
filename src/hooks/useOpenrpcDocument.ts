import { useEffect, useState } from "react";

const useOpenrpcDocument = (openrpcDocument?: string, schemaUrl?: string) => {

    const [openrpcDoc, setOpenrpcDoc] = useState<any>(openrpcDocument);
    useEffect(() => {
      async function retrieveOpenrpcDocument() {
        try {
          if (!openrpcDocument && schemaUrl) {
            const response = await fetch(schemaUrl);
            const doc = await response.json();
            setOpenrpcDoc(doc);
          }

        } catch (e) {
          setOpenrpcDoc(undefined);
        }
      }
      retrieveOpenrpcDocument();
    }, [openrpcDocument, schemaUrl]);
    return openrpcDoc;
};

export default useOpenrpcDocument;
