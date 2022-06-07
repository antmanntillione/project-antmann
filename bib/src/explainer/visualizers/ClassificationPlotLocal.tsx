import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Container from "react-bootstrap/Container";
import { useTranslation } from "react-i18next";

/**
 * The local classification plot shows the prediction probability for each category
 * @param props the given instance containing the ground truth and the prediction probability
 *  for every possible classification
 */
export const ClassificationPlotLocal = (props: {
  instance: Array<{
    ground_truth: string;
    classification: { [key: string]: number };
  }>;
}) => {
  const { t } = useTranslation();
  const ground_truth = props.instance[0].ground_truth;
  const classification = props.instance[0].classification;
  let category: Array<string> = [];
  for (let key in classification) {
    category.push(key);
  }
  let values: Array<number> = [];
  for (let key in classification) {
    values.push(Math.round(classification[key] * 100) / 100);
  }
  /*these are the options for the plot. Most of them should be self-explanatory,
    however for details see: https://api.highcharts.com/highcharts/plotOptions.bar */
  const options: Highcharts.Options = {
    chart: {
      type: "bar",
    },
    title: {
      text: t("explainer.results.classification"),
    },
    xAxis: {
      categories: category,
    },
    series: [{ showInLegend: false, data: values, type: "bar" }],
    credits: {
      enabled: false,
    },
    tooltip: {
      //This ensures that the tooltip only shows the value
      formatter(
        this: Highcharts.TooltipFormatterContextObject,
        tooltip: Highcharts.Tooltip
      ) {
        return this.y.toFixed(2);
      },
    },
    yAxis: {
      title: {
        text: t("explainer.results.probability"),
      },
      gridLineWidth: 0,
      tickInterval: 0.1,
      min: 0,
      max: 1,
    },
  };
  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} />
      {t("explainer.results.ground_truth") + ": " + ground_truth}
    </>
  );
};
