import React from "react";

import { Classifier, XAIModel, Dataset, Parameter } from "../api";
import Container from "react-bootstrap/Container";

import { Switch, Route, Redirect, useLocation, useHistory } from "react-router";
import { OptionsConfigurator } from "./OptionsConfigurator";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { JobProcessorTimeseries } from "./timeseries/JobProcessorTimeseries";
import { JobProcessorImages } from "./images/JobProcessorImages";

export type instance_index = number;
export type instance_count = number;

export interface ExplainerParameters {
  classifier: Classifier | null;
  global_local: "global" | "local" | null;
  xai_models: Array<XAIModel>;
  dataset: Dataset | null;
  instance_amount: number;
  instance: number;
  parameter: {
    [name: string]: {
      [name: string]: Parameter;
    };
  };
}

/**
 * This renders whole Explainer Flow aswell as the Results Page.
 */
export const ExplainerMenu = () => {
  const [
    jobParameters,
    setParameters,
  ] = React.useState<ExplainerParameters | null>(null);

  const history = useHistory();
  const onSubmit = (values: ExplainerParameters) => {
    setParameters(values);
    history.push("/explain/results");
  };

  const { t } = useTranslation();

  return (
    <Switch>
      <Route path="/explain/results">
        
        {!jobParameters && <Redirect to="/explain" />}

        {jobParameters !== null && 
          (jobParameters.dataset?.dataset_type == "timeseries" || jobParameters?.dataset?.dataset_type == "timeseries_georeferenced") &&
          <JobProcessorTimeseries {...jobParameters}/>}

        {jobParameters !== null &&
        jobParameters.dataset?.dataset_type == "image" &&
        <JobProcessorImages {...jobParameters}/>}

      </Route>
      <Route path="/">
        <Container fluid className="pl-xs-none pl-xl-5 pb-4">
          <OptionsConfigurator
            onSubmit={onSubmit}
            initialValues={jobParameters}
          />
        </Container>
      </Route>
    </Switch>
  );
};
