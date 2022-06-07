import React from "react";
import { XaiModelPlotBuilder } from "../visualizers/ExplanationPlotBuilder";
import { ResultsParameterView } from "./ResultsParameterView";
import { api_manager, Instance } from "../../api";
import { UserRating } from "./UserRating";
import { useTranslation } from "react-i18next";
import Tabs from "../../util/CustomTabs";
import Tab from "react-bootstrap/Tab";
import Button from "react-bootstrap/Button";
import { ExplainerParameters } from "../ExplainerMenu";
import { LinkContainer } from "react-router-bootstrap";

interface ResultsPageProps {
  explanation: ExplainerResultProps;
  parameters: ExplainerParameters;
  responseTime: number;
}

interface ExplainerResultProps {
  feature_names: Array<string>;
  instances: Array<{
    ground_truth: string;
    classification: { [key: string]: number };
  }>;
  models: Array<XAIModelResult>;
}

export interface XAIModelResult {
  name: string;
  diagram_types: Array<string>;
  result: number[][][] | number[][];
}

/**
 * This is the main entry point to the Results Page
 */
export const TimeseriesExplainerResultsPage = (props: ResultsPageProps) => {
  const [instance, setInstance] = React.useState<Instance | undefined>(
    undefined
  );
  React.useEffect(() => {
    if (props.parameters.global_local === "local") {
      api_manager
        .getInstance(props.parameters.dataset!.id, props.parameters.instance)
        .then((response) => {
          setInstance(response);
        })
        .catch(() => {});
    }
  }, [
    props.parameters.dataset,
    props.parameters.global_local,
    props.parameters.instance,
  ]);

  const { t } = useTranslation();
  let settings: Array<[string, string]> = [];
  settings.push([
    t("explainer.results.classification_model"),
    props.parameters.classifier!.name,
  ]);
  settings.push([
    t("explainer.results.xai_models"),
    props.parameters.xai_models.map((x) => x.name).join(", "),
  ]);
  settings.push([
    t("explainer.results.dataset"),
    props.parameters.dataset!.name,
  ]);
  settings.push([
    t("explainer.results.feature_names"),
    props.parameters.dataset!.additional_params.feature_names.join(", "),
  ]);
  settings.push([
    t("explainer.results.response_time"),
    (props.responseTime / 1000).toFixed(3) + "s",
  ]);
  if (instance === undefined && props.parameters.global_local === "local") {
    return <></>;
  }
  return (
    <div className="flex-grow-1 d-flex overflow-hidden">
      <div className="col-4 d-flex flex-column">
        <div className="overflow-auto scrollbar-gutter">
          <ResultsParameterView
            classification={props.explanation.instances}
            instance={instance}
            view={props.parameters.global_local!}
            featureNames={
              props.parameters.dataset!.additional_params.feature_names
            }
            settings={settings}
            datasetType={props.parameters.dataset!.dataset_type}
          />
          <LinkContainer to="/explain">
            <Button size="lg">{t("explainer.results.modify_parameter")}</Button>
          </LinkContainer>
        </div>
      </div>
      <div className="col-8 d-flex flex-column">
        <Tabs id="explanationPlots" mountOnEnter={true}>
          {props.explanation.models.map((model) => (
            <Tab key={model.name} eventKey={model.name} title={model.name}>
              <>
                <XaiModelPlotBuilder
                  model={model}
                  classification={props.explanation.instances}
                  explainerFeatureNames={props.explanation.feature_names}
                  instanceFeatureNames={
                    props.parameters.dataset?.additional_params.feature_names
                  }
                  view={props.parameters.global_local!}
                  instance={instance}
                  datasetType={props.parameters.dataset!.dataset_type}
                />
                <UserRating
                  datasetID={props.parameters.dataset!.id}
                  classifierID={props.parameters.classifier!.uuid}
                  xaiModelName={model.name}
                />
              </>
            </Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
