import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";
import { useTranslation } from "react-i18next";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

//this is needed to make box plot work
HighchartsMore(Highcharts);

/*This interface serves as the input format for the highcharts series option.
 The type always has to be set in typescript*/
interface BoxProps {
  name: string;
  data: Array<Array<number>>;
  type: "boxplot";
  showInLegend: false;
  fillColor: string;
}

/**
 * Box plot(s) is used for global explanations only. This component creates one box plot for overall classification
 *  and one for each possible classification (if at least one instance was classified from this category)
 * @param props the feature names of the dataset, the model's prediction and the explanation result
 */
export const BoxPlots = (props: {
  featureNames: Array<string>;
  colors: Array<string>;
  classifications: Array<string>;
  data: Array<Array<Array<number>>>;
}) => {
  const { t } = useTranslation();
  const numFeatures = props.featureNames.length;
  const numSamples = props.data[0].length;
  //create all box plot instances
  let boxPlots: Array<BoxProps> = [];
  boxPlots.push({
    name: t("explainer.results.overall"),
    data: new Array(numFeatures).fill(null).map((x) => []),
    type: "boxplot",
    showInLegend: false,
    fillColor: "#1245A8",
  });
  let colorIndex = 0;
  props.classifications.forEach((classification, index) => {
    //create feature importance for the current instance/classification
    let features: Array<number> = new Array(numFeatures).fill(0);
    props.data[index].forEach((sample) => {
      for (let j = 0; j < numFeatures; j++) {
        features[j] += sample[j];
      }
    });
    for (let i = 0; i < numFeatures; i++) {
      features[i] =
        Math.round(Math.abs(features[i] / numSamples) * 100000) / 100000;
    }
    //push feature importance to corresponding boxplot
    const plotIndex = boxPlots.findIndex(
      (element) => element.name === classification
    );
    if (plotIndex === -1) {
      let boxPlot: BoxProps = {
        name: classification,
        data: features.map((x) => [x]),
        type: "boxplot",
        showInLegend: false,
        fillColor: props.colors[colorIndex++],
      };
      boxPlots.push(boxPlot);
    } else {
      for (let i = 0; i < numFeatures; i++) {
        boxPlots[plotIndex].data[i].push(features[i]);
      }
    }
    // first entry in Box plot is the overall plot
    for (let i = 0; i < numFeatures; i++) {
      boxPlots[0].data[i].push(features[i]);
    }
  });

  /* highcharts box plot accepts preprocessed data only, so here the necessary parameters
     (i.e. min, lower quartile, median, upper quartile and max) are determined manually */
  for (let i = 0; i < boxPlots.length; i++) {
    for (let j = 0; j < numFeatures; j++) {
      const sorted = boxPlots[i].data[j].sort();
      const sortedLength = sorted.length;
      let stats: Array<number> = new Array(5);
      stats[0] = sorted[0];
      stats[1] = sorted[Math.round(sortedLength / 4) - 1];
      stats[2] = sorted[Math.round(sortedLength / 2) - 1];
      stats[3] = sorted[Math.round((sortedLength * 3) / 4) - 1];
      stats[4] = sorted[sortedLength - 1];
      boxPlots[i].data[j] = stats;
    }
  }
  //This function returns the necessary options to plot the data for each box plot
  const specificOptions = (plotInfo: BoxProps) => {
    /*these are the options for the plot. Most of them should be self-explanatory,
         however for details see: https://api.highcharts.com/highcharts/plotOptions.boxplot */
    const options: Highcharts.Options = {
      chart: {
        type: "boxplot",
      },
      title: {
        text: plotInfo.name,
      },
      xAxis: {
        categories: props.featureNames,
      },
      plotOptions: {
        boxplot: {
          fillColor: plotInfo.fillColor,
          medianColor: "#000000",
          color: "#000000",
          whiskerColor: "#000000",
        },
      },
      series: [plotInfo],
      credits: {
        enabled: false,
      },
    };
    return options;
  };
  //we are returning all box plots as a tab
  return (
    <>
      <h4>{t("explainer.results.box_plots")}</h4>
      <Tabs id="uncontrolled-tab-example">
        {boxPlots.map((boxPlot) => (
          <Tab key={boxPlot.name} eventKey={boxPlot.name} title={boxPlot.name}>
            <HighchartsReact
              highcharts={Highcharts}
              options={specificOptions(boxPlot)}
            />
          </Tab>
        ))}
      </Tabs>
    </>
  );
};
