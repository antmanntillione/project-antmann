import React from "react";
import Highcharts, { color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Container from "react-bootstrap/Container";
import { useTranslation } from "react-i18next";

/**
 * Divergent plot is used for local explanations only. This component creates the divergent plot which shows the impact of certain time slices
 *  on the classification
 * @param props the number of samples which the instance has,
 * as well as the model's result (currently the only model supporting divergent plot is LimeForTime)
 */
export const DivergentPlot = (props: {
  numSamples: number;
  result: Array<[number, number]>;
}) => {
  const { t } = useTranslation();
  const outputSize = props.result.length;
  let categories: Array<string> = new Array(outputSize);

  let colors: Array<string> = new Array(outputSize);
  let values: Array<number> = new Array(outputSize);
  const timeSliceString = (input: number) => {
    let endofSlice = Math.ceil(
      ((input + 1) / outputSize) * props.numSamples - 1
    );
    endofSlice =
      endofSlice > props.numSamples - 1 ? props.numSamples - 1 : endofSlice;
    return (
      Math.ceil((input / outputSize) * props.numSamples) + "-" + endofSlice
    );
  };
  props.result.forEach((slice) => {
    categories[slice[0]] = timeSliceString(slice[0]);
    let importance = slice[1];
    importance = Math.round(importance * 100000) / 100000;
    values[slice[0]] = importance;
    //first string is hex for green, second string is hex for red
    if (importance >= 0) {
      colors[slice[0]] = "#287233";
    } else {
      colors[slice[0]] = "#FF6666";
    }
  });
  /*these are the options for the plot. Most of them should be self-explanatory,
    however for details see: https://api.highcharts.com/highcharts/plotOptions.bar */
  const options: Highcharts.Options = {
    chart: {
      type: "bar",
    },
    title: {
      text: t("explainer.results.divergent_plot"),
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
    xAxis: {
      title: {
        text: t("explainer.results.time_series_steps"),
      },
      categories: categories,
      labels: {
        step: 1,
      },
    },
    plotOptions: {
      bar: {
        colorByPoint: true,
        colors: colors,
      },
    },
    series: [{ showInLegend: false, data: values, type: "bar" }],
    credits: {
      enabled: false,
    },
    yAxis: {
      title: {
        text: t("explainer.results.relative_importance"),
      },
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};
