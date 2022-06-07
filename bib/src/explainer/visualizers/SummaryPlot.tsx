import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Container from "react-bootstrap/Container";
import { useTranslation } from "react-i18next";

/*This interface serves as the input format for the highcharts series option.
 The type always has to be set in typescript*/
interface BarProps {
  name: string;
  data: Array<number>;
  type: "bar";
  color: string;
}

/**
 * Summary plot is used for global explanations only. This component creates the summary plot which shows the impact of each feature
 *  on the classification as a stacked bar chart
 * @param props the feature names as well as the classifiers prediction and the model's result  (currently the models supporting feature importance plot are PIG, SHAPDeep and SHAPGradient)
 */
export const SummaryPlot = (props: {
  featureNames: Array<string>;
  data: Array<Array<Array<number>>>;
  colors: Array<string>;
  classifications: Array<string>;
}) => {
  const { t } = useTranslation();
  const numInstances = props.classifications.length;
  const numFeatures = props.featureNames.length;
  const numSamples = props.data[0].length;
  let numClassifications: Array<[string, number]> = [];
  props.classifications.forEach((classification) => {
    const classificationIndex = numClassifications.findIndex(
      (element) => element[0] === classification
    );
    if (classificationIndex === -1) {
      numClassifications.push([classification, 1]);
    } else {
      numClassifications[classificationIndex][1]++;
    }
  });
  let featureImportanceAll: Array<BarProps> = [];
  let colorIndex = 0;
  //calculate the feature importance for each instance and push it to the right category
  for (let i = 0; i < numInstances; i++) {
    const classificationIndex = featureImportanceAll.findIndex(
      (x) => x.name === props.classifications[i]
    );
    if (classificationIndex === -1) {
      let featureImportance: BarProps = {
        name: props.classifications[i],
        data: new Array(numFeatures).fill(0),
        type: "bar",
        color: props.colors[colorIndex++],
      };
      props.data[i].forEach((sample) => {
        for (let j = 0; j < numFeatures; j++) {
          featureImportance.data[j] += sample[j];
        }
      });
      featureImportanceAll.push(featureImportance);
    } else {
      props.data[i].forEach((sample) => {
        for (let j = 0; j < numFeatures; j++) {
          featureImportanceAll[classificationIndex].data[j] += sample[j];
        }
      });
    }
  }

  //this array is needed later to sort by most important feature
  let featuresAndImportance: Array<[string, number]> = [];
  props.featureNames.forEach((feature) => {
    featuresAndImportance.push([feature, 0]);
  });
  for (let i = 0; i < featureImportanceAll.length; i++) {
    for (let j = 0; j < numFeatures; j++) {
      //unlike feature importance plot, the summary plot only looks at absolute values for displaying purposes
      featureImportanceAll[i].data[j] = Math.abs(
        featureImportanceAll[i].data[j] /
          (numClassifications[i][1] * numSamples)
      );
      featuresAndImportance[j][1] += featureImportanceAll[i].data[j];
    }
  }

  //sort by most important feature
  featuresAndImportance.sort((a, b) => b[1] - a[1]);
  for (let i = 0; i < featureImportanceAll.length; i++) {
    let newData: Array<number> = new Array(featureImportanceAll[i].data.length);
    featureImportanceAll[i].data.forEach((value, index) => {
      newData[
        featuresAndImportance.findIndex(
          (x) => x[0] === props.featureNames[index]
        )
      ] = value;
    });
    featureImportanceAll[i].data = newData;
  }
  /*these are the options for the plot. Most of them should be self-explanatory,
    however for details see: https://api.highcharts.com/highcharts/plotOptions.heatmap */
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
        return this.y.toFixed(5);
      },
    },
    plotOptions: {
      series: {
        stacking: "normal",
      },
    },
    xAxis: {
      title: {
        text: t("explainer.results.features"),
      },

      categories: featuresAndImportance.map((x) => x[0]),
    },
    series: featureImportanceAll,
    credits: {
      enabled: false,
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};
