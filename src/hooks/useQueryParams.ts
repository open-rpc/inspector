import { useState } from "react";
import * as qs from "qs";

const useQueryParams = (depth?: number) => {
  const parse = () => {
    return qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
      depth: depth || 100,
      decoder(str) {
        if (/^([+-]?[0-9]\d*|0)$/.test(str)) {
          return parseInt(str, 10);
        }
        if (str === "false") {
          return false;
        }
        if (str === "true") {
          return true;
        }
        return decodeURIComponent(str);
      },
    });
  };
  const [query] = useState(parse());
  return [query];
};

export default useQueryParams;
