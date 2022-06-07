import React from "react";
import "./Step.css";

export const Step = (props: React.PropsWithChildren<{ title: string }>) => {
  return (
    <h4 className="my-4">
      <span className="step__number" />
      {props.title}
    </h4>
  );
};
