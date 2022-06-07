import React from "react";
import Alert from "react-bootstrap/Alert";

/**
 * A template for an error message
 * @param props the error message
 */
export const ErrorAlert = (props: { error?: string }) => {
  return (
    <Alert key={props.error} show={!!props.error} variant="danger">
      {props.error}
    </Alert>
  );
};
