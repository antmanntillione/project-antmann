import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useTranslation } from "react-i18next";
import {
  AdditiveForceVisualizerProps,
  AdditiveForceVisualizer,
  CmapName,
} from "shapjs";
import { Instance } from "../../api";

interface ForcePlotProps {
  classification: { [key: string]: number };
  shap_values: Array<Array<number>>; //[k,n] for n samples - For Kernel Explainer this means a single class
  instance?: Instance;
  feature_names?: Array<string>;
  out_name?: string;
  labelMargin?: number;
  colorMap?: CmapName | [string, string];
  hideBaseValueLabel?: boolean;
}

/**
 * @property {number} probability - Probability for the classification
 * @property {Array<Array<number>>} shap_values - The [k,n] SHAP Values for n samples - For Kernel Explainer this means a single class
 * @prop {Instance} instance - The raw instance data
 * @prop {Array<string>} feature_names - The list of features, however SHAP sees every sample as a feature, so probably just omit it
 * @prop {string} out_name - The label of the classification probability
 * @prop {number} labelMargin - Margin of labels, best just ommited / set to zero
 * @prop {CmapName | [string, string]} colorMap - Either a predefined Color Map or a tuple of two CSS Color Module Level 3 specifier strings.
 * @prob {boolean} hideBaseValueLabel - When true, "base value" will be hidden in the diagram
 */
export const ForcePlot = (props: ForcePlotProps) => {
  const { t } = useTranslation();
  let featureNames: Array<string>;
  if (props.feature_names === undefined) {
    featureNames = new Array(props.shap_values[0].length)
      .fill(null)
      .map((_x, index) => index.toString());
  } else {
    featureNames = props.feature_names;
  }

  let display_features: Array<number> | undefined;
  if (props.instance !== undefined) {
    display_features = props.instance[0];
  }

  let classificationTuples: Array<[string, number]> = [];
  for (let key in props.classification) {
    classificationTuples.push([key, props.classification[key]]);
  }
  let allParams: Array<AdditiveForceVisualizerProps> = [];
  classificationTuples.forEach((tuple, index) => {
    const params: AdditiveForceVisualizerProps = {
      outNames: props.out_name ? [props.out_name] : ["Probability"],
      plot_cmap: props.colorMap ? props.colorMap : "RdBu",
      baseValue:
        tuple[1] - props.shap_values[index].reduce((acc, x) => acc + x),
      link: "identity",
      featureNames: featureNames,
      features: [],
      labelMargin: props.labelMargin ? props.labelMargin : 0,
      hideBaseValueLabel: props.hideBaseValueLabel,
    };

    for (let j = 0; j < featureNames.length; j++) {
      params.features.push({
        effect: props.shap_values[index][j],
        value: display_features ? display_features[j] : undefined,
      });
    }
    allParams.push(params);
  });

  return (
    <>
      <h4>{t("explainer.results.force_plot")}</h4>
      <Tabs defaultActiveKey={classificationTuples[0][0]} unmountOnExit={true}>
        {classificationTuples.map((tuple, index) => (
          <Tab title={tuple[0]} eventKey={tuple[0]} key={tuple[0]}>
            <AdditiveForceVisualizer {...allParams[index]} />
          </Tab>
        ))}
      </Tabs>
    </>
  );
};
