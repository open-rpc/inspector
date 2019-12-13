import React, { RefObject } from "react";
import { makeStyles } from "@material-ui/core/styles";

interface IProps {
  width?: string | number;
  height?: string | number;
  loading?: Element | string;
  isEditorReady: boolean;
  reference: RefObject<any>;
}

const useStyles = makeStyles({
  wrapper: {
    display: "flex",
    position: "relative",
    textAlign: "initial",
  },
  fullWidth: {
    width: "100%",
  },
  hide: {
    display: "none",
  },
});

const MonacoContainer: React.FC<IProps> = ({ width, height, isEditorReady, loading, reference }) => {
  const classes = useStyles({});
  return (
    <section className={classes.wrapper} style={{ width, height }}>
      {/* {!isEditorReady && <Loading content={loading} />} */}
      <div
        ref={reference}
        className={classes.fullWidth}
      />
    </section>
  );
};

export default MonacoContainer;
