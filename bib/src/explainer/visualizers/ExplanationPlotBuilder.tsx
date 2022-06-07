import React from "react";
import { InstancePlotFactory } from "./InstancePlotFactory";
import { BoxPlots } from "./BoxPlots";
import { DivergentPlot } from "./DivergentPlot";
import { FeatureImportancePlot } from "./FeatureImportancePlot";
import { HeatPlot } from "./HeatPlot";
import { ForcePlot } from "./ShapPlots";
import { SummaryPlot } from "./SummaryPlot";
import { Instance, XAIModelResult, ClassifierInstance } from "../../api";

interface ExplanationResponseProps {
  model: XAIModelResult;
  classification: Array<ClassifierInstance>;
  explainerFeatureNames: Array<string>;
  instanceFeatureNames?: Array<string>;
  view: "global" | "local";
  instance?: Instance;
  datasetType: string;
}

interface PlotFactoryProps {
  explanation: XAIModelResult["result"];
  classification?: ClassifierInstance["classification"];
  explainerFeatureNames?: Array<string>;
  instanceFeatureNames?: Array<string>;
  numSamples?: number;
  type: string;
  instance?: Instance;
  datasetType: string;
}

/**
 * This component renders all plots for a given xai-model
 * @param props the model, the classification, the feature names (instance feature names is only relevant for AIS-Data),
 *  the amount of samples that each instance has and whether the explanation was global or not
 */
export const XaiModelPlotBuilder = (props: ExplanationResponseProps) => {
  if (props.view === "global" && props.instanceFeatureNames) {
    const { classifications, colorSeries } = getClassificationAndSeriesColor(
      props.classification.map((x) => x.classification)
    );
    return (
      <>
        <SummaryPlot
          featureNames={props.explainerFeatureNames}
          data={props.model.result as number[][][]}
          classifications={classifications}
          colors={colorSeries}
        />
        <BoxPlots
          featureNames={props.explainerFeatureNames}
          data={props.model.result as number[][][]}
          classifications={classifications}
          colors={colorSeries}
        />
      </>
    );
  } else if (props.view === "local") {
    return (
      <>
        {props.model.diagram_types.map((diagram) => (
          <ExplainerPlotFactory
            key={diagram}
            explanation={props.model.result}
            classification={
              props.classification.map((x) => x.classification)[0]
            }
            explainerFeatureNames={props.explainerFeatureNames}
            instanceFeatureNames={props.instanceFeatureNames}
            numSamples={props.instance!.length}
            type={diagram}
            instance={props.instance}
            datasetType={props.datasetType}
          />
        ))}
      </>
    );
  } else {
    throw new Error("Invalid view");
  }
};

/**
 * This component renders a plot which matches the given plot name
 * @param props the corresponding explanation, the classification, the instances's feature names (can differ from the feature names given by the explainer),
 *  the explainer's feature names for the instance, the amount of samples that each instance has, the plot type (i.e. the plot name) and the instance data (needed for mapping on instance)
 */
const ExplainerPlotFactory = (props: PlotFactoryProps) => {
  switch (props.type) {
    case "mapping on instance":
      if (props.instance && props.instanceFeatureNames) {
        return (
          <InstancePlotFactory
            instance={props.instance}
            featureNames={props.instanceFeatureNames}
            datasetType={props.datasetType}
            result={props.explanation as Array<[number, number]>}
          />
        );
      } else {
        throw new Error("Missing Parameter");
      }
    case "feature importance plot":
      if (props.explainerFeatureNames) {
        return (
          <FeatureImportancePlot
            featureNames={props.explainerFeatureNames!}
            data={props.explanation as Array<[number, number]>}
          />
        );
      } else {
        throw new Error("Missing Parameter");
      }
    case "heat plot":
      if (props.explainerFeatureNames) {
        return (
          <HeatPlot
            featureNames={props.explainerFeatureNames!}
            data={props.explanation as number[][]}
          />
        );
      } else {
        throw new Error("Missing Parameter");
      }
    case "divergent plot":
      if (props.numSamples) {
        return (
          <DivergentPlot
            numSamples={props.numSamples}
            result={props.explanation as Array<[number, number]>}
          />
        );
      } else {
        throw new Error("Missing Parameter");
      }
    case "force plot":
      if (props.classification && props.instance) {
        return (
          <ForcePlot
            instance={props.instance}
            classification={props.classification}
            shap_values={props.explanation as number[][]}
          />
        );
      } else {
        throw new Error("Missing Parameter");
      }
    default:
      return <></>;
  }
};

//These are the colors used for the different series
const colors = [
  "#7cb5ec",
  "#434348",
  "#90ed7d",
  "#f7a35c",
  "#8085e9",
  "#f15c80",
  "#e4d354",
  "#2b908f",
  "#f45b5b",
  "#91e8e1",
];
/**
 * Returns the classification for each instance and the color for each class (a color is only assigned to a class if it was classified at least once )
 * @param prediction The classifier's prediction
 */
const getClassificationAndSeriesColor = (
  prediction: Array<{ [key: string]: number }>
) => {
  let colorIndex = 0;
  let colorSeries: Array<string> = [];
  let classifications: Array<string> = [];
  prediction.forEach((prediction) => {
    let classification = "";
    let max = 0;
    for (let key in prediction) {
      if (prediction[key] > max) {
        classification = key;
        max = prediction[key];
      }
    }
    classifications.push(classification);
    const seriesIndex = colorSeries.findIndex((x) => x[0] === classification);
    if (seriesIndex === -1) {
      colorSeries.push(colors[colorIndex++ % colors.length]);
    }
  });
  return { classifications, colorSeries };
};
