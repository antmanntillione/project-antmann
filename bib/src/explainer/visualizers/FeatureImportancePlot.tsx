import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Container from "react-bootstrap/Container";
import { useTranslation } from "react-i18next";

/**
 * Feature importance plot is used for local explanations only. This component creates the feature importance plot which shows the impact of each feature
 *  on the classification
 * @param props the feature names as well as the model's result (currently the models supporting feature importance plot are PIG, SHAPDeep and SHAPGradient)
 */
export const FeatureImportancePlot = (props: {
  featureNames: Array<string>;
  data: Array<Array<number>>;
}) => {
  const { t } = useTranslation();
  const numFeatures = props.featureNames.length;
  const numSamples = props.data.length;
  //calculate importance of each feature
  let featureImportance: Array<number> = new Array(
    props.featureNames.length
  ).fill(0);
  props.data.forEach((sample) => {
    for (let i = 0; i < numFeatures; i++) {
      featureImportance[i] += sample[i];
    }
  });

  //sort by most important feature
  let featuresAndImportance: Array<[string, number]> = [];
  for (let i = 0; i < numFeatures; i++) {
    featureImportance[i] = Math.abs(
      Math.round((featureImportance[i] / numSamples) * 10000) / 10000
    );
    featuresAndImportance.push([props.featureNames[i], featureImportance[i]]);
  }
  featuresAndImportance.sort((a, b) => b[1] - a[1]);

  /*these are the options for the plot. Most of them should be self-explanatory,
    however for details see: https://api.highcharts.com/highcharts/plotOptions.bar */
  const options: Highcharts.Options = {
    chart: {
      type: "bar",
    },
    title: {
      text: t("explainer.results.feature_importance_plot"),
    },
    tooltip: {
      //This ensures that the tooltip only shows the value
      formatter(
        this: Highcharts.TooltipFormatterContextObject,
        tooltip: Highcharts.Tooltip
      ) {
        return this.y.toFixed(4);
      },
    },
    xAxis: {
      title: {
        text: t("explainer.results.features"),
      },
      categories: featuresAndImportance.map((x) => x[0]),
    },
    //type for series always has to be set in typescript
    series: [
      {
        showInLegend: false,
        data: featuresAndImportance.map((x) => x[1]),
        type: "bar",
      },
    ],
    credits: {
      enabled: false,
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};
