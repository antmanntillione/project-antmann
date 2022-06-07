import React from "react";
import { DatasetType } from "../../form_components";
import { AISVisualizer } from "./AIS";
import { InstanceWithMapping } from "./InstanceWithMapping";

/**
 * This component displays an instance. It shows the trajectory if the data is ais-data (timeseries_georeferenced)
 *  and a line graph for each feature (timeseries) otherwise
 * @param props the instance, given as a 2-dimensional array, the feature names (by convention only ais-data contains features with the name "lon" and "lat")
 *  and the result (i.e. the explanation)used for the mapping on instance plot
 */
export const InstancePlotFactory = (props: {
  instance: Array<Array<number>>;
  featureNames: Array<string>;
  datasetType: string;
  result?: Array<[number, number]>;
}) => {
  if (props.datasetType === "timeseries_georeferenced") {
    return (
      <AISVisualizer
        feature_names={props.featureNames}
        data={props.instance}
        divergent={props.result}
      />
    );
  } else if (props.datasetType === "timeseries") {
    return (
      <InstanceWithMapping
        featureNames={props.featureNames}
        data={props.instance}
        result={props.result}
      />
    );
  }
  else {
    return <></>
  }
};
