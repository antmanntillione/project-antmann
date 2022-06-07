import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Container from "react-bootstrap/Container";
import { useTranslation } from "react-i18next";

/**
 * The global classification plot shows how many instances where classified for every category
 * @param props the given instances, each containing the ground truth and the prediction probability
 *  for every possible classification
 */
export const ClassificationPlotGlobal = (props: {
  instances: Array<{
    ground_truth: string;
    classification: { [key: string]: number };
  }>;
}) => {
  const { t } = useTranslation();
  let ground_truths: Array<string> = [];
  //determine the model's classification for every instance
  let classifications: Array<{ [key: string]: number }> = [];
  props.instances.map((instance) => {
    ground_truths.push(instance.ground_truth);
    classifications.push(instance.classification);
  });
  let category: Array<string> = [];
  let hits = 0;
  for (let key in classifications[0]) {
    category.push(key);
  }
  let values: Array<number> = new Array<number>(category.length).fill(0);
  //add the classification for each instance to the corresponding category
  classifications.forEach((instance, index) => {
    let classification = "";
    let max = 0;
    for (let key in instance) {
      if (instance[key] > max) {
        max = instance[key];
        classification = key;
      }
    }
    const classificationIndex = category.indexOf(classification);
    values[classificationIndex]++;
    if (classification === ground_truths[index]) {
      hits++;
    }
  });
  /*these are the options for the plot. Most of them should be self-explanatory,
    however for details see: https://api.highcharts.com/highcharts/plotOptions.bar */
  const options: Highcharts.Options = {
    chart: {
      type: "bar",
    },
    title: {
      text: t("explainer.results.classification"),
    },
    tooltip: {
      //This ensures that the tooltip only shows the value
      formatter(
        this: Highcharts.TooltipFormatterContextObject,
        tooltip: Highcharts.Tooltip
      ) {
        return this.y.toString();
      },
    },
    xAxis: {
      categories: category,
    },
    series: [{ showInLegend: false, data: values, type: "bar" }],
    credits: {
      enabled: false,
    },
    yAxis: {
      title: {
        text: t("explainer.results.number_of_classifications"),
      },
      tickInterval: 1,
      min: 0,
      max: ground_truths.length,
    },
  };
  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} />
      <span>
        {t("explainer.results.accuracy") +
          ": " +
          ((hits * 100) / ground_truths.length).toFixed(1) +
          "%"}{" "}
      </span>
      <br />
      <span>
        {t("explainer.results.number_of_instances") +
          ": " +
          ground_truths.length}
      </span>
    </>
  );
};
