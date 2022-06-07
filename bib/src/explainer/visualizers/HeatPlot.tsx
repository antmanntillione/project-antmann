import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Container from "react-bootstrap/Container";
import { useTranslation } from "react-i18next";
import Heatmap from "highcharts/modules/heatmap.src.js";

//this is needed to make heat plot work
Heatmap(Highcharts);

/**
 * Heat plot is used for local explanations only. This component creates a heat plot which shows the impact that each feature had for every sample
 *  on the classification
 * @param props the feature names as well as the model's result (currently the models supporting heat plot are PIG, SHAPDeep and SHAPGradient)
 */
export const HeatPlot = (props: {
  featureNames: Array<string>;
  data: Array<Array<number>>;
}) => {
  let max = Math.round(props.data[0][0] * 10000) / 10000;
  let chartInput: Array<number[]> = [];
  for (let i = 0; i < props.data.length; i++) {
    for (let j = 0; j < props.data[i].length; j++) {
      const current = Math.round(props.data[i][j] * 10000) / 10000;
      if (max < Math.abs(current)) {
        max = Math.abs(current);
      }
      chartInput.push([i, j, current]);
    }
  }

  const { t } = useTranslation();
  /*these are the options for the plot. Most of them should be self-explanatory,
    however for details see: https://api.highcharts.com/highcharts/plotOptions.heatmap */
  const options: Highcharts.Options = {
    chart: {
      type: "heatmap",
    },
    //could be necessary for large instances
    boost: {
      useGPUTranslations: true,
    },
    title: {
      text: t("explainer.results.heat_plot"),
    },
    tooltip: {
      //This ensures that the tooltip only shows the value
      formatter(
        this: Highcharts.TooltipFormatterContextObject,
        tooltip: Highcharts.Tooltip
      ) {
        return this.point.options.value?.toFixed(3);
      },
    },
    xAxis: {
      min: 0,
      max: props.data.length,
      title: {
        text: t("explainer.results.time_series_steps"),
      },
    },
    yAxis: {
      categories: props.featureNames,
      reversed: true,
      title: {
        text: t("explainer.results.features"),
      },
    },
    colorAxis: {
      /*this chooses the gradient. we have chosen to stick to the SHAP color theme,
             however this can be changed of course */
      stops: [
        [0, "#ff0d57"],
        [0.5, "#FFFFFF"],
        [1, "#1f88e5"],
      ],
      min: -max,
      max: max,
    },
    //type needs to be set when usin typescript
    series: [{ data: chartInput, type: "heatmap", turboThreshold: 0 }],
    credits: {
      enabled: false,
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};
