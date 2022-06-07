import React from "react";
import { InstancePlotFactory } from "../visualizers/InstancePlotFactory";
import { ClassificationPlotLocal } from "../visualizers/ClassificationPlotLocal";
import { ClassificationPlotGlobal } from "../visualizers/ClassificationPlotGlobal";
import Table from "react-bootstrap/Table";

interface ResultsMenuProps {
  classification: Array<{
    ground_truth: string;
    classification: { [key: string]: number };
  }>;
  instance?: Array<Array<number>>;
  view: "global" | "local";
  featureNames?: Array<string>;
  settings: Array<[string, string]>;
  datasetType: string;
}

/**
 * This displays the Table with the Job Parameters on the result page
 */
export const ResultsParameterView = (props: ResultsMenuProps) => {
  if (props.view === "global") {
    return (
      <>
        <ClassificationPlotGlobal instances={props.classification} />
        <Table>
          <tbody>
            {props.settings.map((setting) => (
              <tr key={setting[0]}>
                <td>{setting[0]}</td>
                <td>{setting[1]}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    );
  } else if (props.view === "local" && props.instance && props.featureNames) {
    return (
      <>
        <InstancePlotFactory
          instance={props.instance!}
          featureNames={props.featureNames!}
          datasetType={props.datasetType!}
        />
        <ClassificationPlotLocal instance={props.classification} />
        <Table bordered>
          <tbody>
            {props.settings.map((setting) => (
              <tr key={setting[0]}>
                <td>{setting[0]}</td>
                <td>{setting[1]}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    );
  } else {
    throw new Error("No instances or feature names specified");
  }
};
