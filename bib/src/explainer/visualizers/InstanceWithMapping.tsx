import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTranslation } from "react-i18next";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

interface OptionProps {
  title: string;
  data: Array<number>;
  timestamps: Array<number>;
}

/*This interface serves as the input format for the highcharts series option.
 The type always has to be set in typescript*/
interface ColorBarProps {
  color: string;
  from: number;
  to: number;
}

interface ChartRef {
  /**
   * Chart reference
   */
  chart: Highcharts.Chart;

  /**
   * React reference
   */
  container: React.RefObject<HTMLDivElement>;
}

/**
 * This component displays an instance by plotting a line graph for each feature
 * @param props the feature names of the instance as well as the feature data of the instance
 * if the result of the explanation is given, then it will be mapped on the instance (currently this feature is only supported by LimeForTime)
 */
export const InstanceWithMapping = (props: {
  featureNames: Array<string>;
  data: Array<Array<number>>;
  result?: Array<[number, number]>;
}) => {
  const { t } = useTranslation();
  let colorBars: Array<ColorBarProps>;
  //grid lines are deactivated when mapping on instance because they might only be visible in some slices
  let gridLineWidth = 1;
  if (props.result) {
    const sliceLength = Math.ceil(props.data.length / props.result!.length);
    let max = 0;
    props.result!.forEach((result) => {
      if (Math.abs(result[1]) > max) {
        max = Math.abs(result[1]);
      }
    });
    max = max === 0 ? 1 : max;
    colorBars = new Array(props.result!.length);
    props.result!.forEach((result) => {
      let colorBar: ColorBarProps = {
        color: "",
        from: result[0] * sliceLength,
        to: (result[0] + 1) * sliceLength,
      };
      //determine color of Bar
      let color: string;
      let gradientQuotient: number;
      if (result[1] < 0) {
        gradientQuotient = result[1] / -max;
        color = "rgba(201,60,32," + gradientQuotient.toFixed(2) + ")";
      } else {
        gradientQuotient = result[1] / max;
        color = "rgba(4,99,7," + gradientQuotient.toFixed(2) + ")";
      }
      colorBar.color = color;
      colorBars[result[0]] = colorBar;
    });
    gridLineWidth = 0;
  }

  const refs = React.useRef<Array<ChartRef | null>>([]);

  let parameters: Array<Array<number>> = [];
  const numFeatures = props.featureNames.length;
  const numTimeStamps = props.data.length;
  for (let i = 0; i < numFeatures; i++) {
    let newFeatureValues: Array<number> = [];
    for (let j = 0; j < numTimeStamps; j++) {
      newFeatureValues.push(props.data[j][i + 1]);
    }
    parameters.push(newFeatureValues);
  }
  //This function returns the necessary options to plot the data for each box plot
  const specificOptions = (props: OptionProps) => {
    /*these are the options for the plot. Most of them should be self-explanatory,
         however for details see: https://api.highcharts.com/highcharts/plotOptions.line */
    const options: Highcharts.Options = {
      chart: {
        type: "line",
      },
      title: {
        text: props.title[0].toUpperCase() + props.title.slice(1).toLowerCase(),
        align: "left",
      },
      xAxis: {
        crosshair: true,
        title: {
          text: t("explainer.results.timestamp"),
        },
        tickInterval: 1,
        plotBands: colorBars,
      },
      tooltip: {
        //This ensures that the tooltip only shows the value
        formatter(
          this: Highcharts.TooltipFormatterContextObject,
          tooltip: Highcharts.Tooltip
        ) {
          return this.y.toFixed(3);
        },
        //This positions the tooltip at the top right directly above the graph
        positioner(
          this: Highcharts.Tooltip,
          labelWidth: number,
          labelHeight: number,
          point: Highcharts.TooltipPositionerPointObject
        ) {
          return {
            x: this.chart.chartWidth - labelWidth,
            y: 10,
          };
        },
        borderWidth: 0,
        shadow: false,
        backgroundColor: "none",
        style: {
          fontSize: "18px",
        },
      },
      series: [
        {
          showInLegend: false,
          data: props.data.map((x, index) => [props.timestamps[index], x]),
          type: "line",
        },
      ],
      plotOptions: {
        series: {
          marker: {
            enabled: false,
          },
        },
      },
      credits: {
        enabled: false,
      },
      yAxis: {
        title: {
          text: props.title,
        },
        gridLineWidth: gridLineWidth,
      },
    };
    return options;
  };

  const installEventHandlers = React.useCallback(
    (
      eventType: "mousemove" | "touchmove" | "touchstart",
      container: HTMLDivElement
    ) => {
      container.addEventListener(eventType, (e) => {
        for (const ref of refs.current) {
          const chart = ref?.chart;
          const pEvent = chart?.pointer.normalize(e);

          if (pEvent) {
            //Definition of searchPoint in Series is private
            //According to one dev, this is to keep the docs clean??
            //Anyway this is safe
            //https://github.com/highcharts/highcharts/blob/1b41041b316264dcdb5313604a1b39daa421fcc8/ts/Core/Series/Series.ts#L5929
            const point: Highcharts.Point | undefined = (chart
              ?.series[0] as any).searchPoint(pEvent, true);
            if (point && chart) {
              const normalizedEvent = chart.pointer.normalize(e);
              point.onMouseOver(); // Show the hover marker
              chart.tooltip.refresh(point); // Show the tooltip
              chart.xAxis[0].drawCrosshair(normalizedEvent, point); // Show the crosshair
            }
          }
        }
      });
    },
    [refs]
  );

  React.useEffect(() => {
    for (const ref of refs.current) {
      //Install event handlers
      if (ref?.container.current) {
        installEventHandlers("mousemove", ref.container.current);
        installEventHandlers("touchmove", ref.container.current);
        installEventHandlers("touchstart", ref.container.current);
        ref.chart.pointer.reset = () => undefined;
      }
    }
  }, [refs, installEventHandlers]);

  React.useEffect(() => {
    //https://github.com/highcharts/highcharts/issues/5783
    window.dispatchEvent(new Event("resize"));
  });

  if (props.result) {
    return (
      <>
        <h4>{t("explainer.results.mapping_on_instance")}</h4>
        {props.featureNames.map((featureName, index) => {
          return (
            <HighchartsReact
              key={featureName + index.toString()}
              ref={(element) => (refs.current[index] = element)}
              highcharts={Highcharts}
              options={specificOptions({
                title: featureName,
                data: parameters[index],
                timestamps: props.data.map((x) => x[0]),
              })}
            />
          );
        })}
      </>
    );
  } else {
    return (
      <>
        <h4>{t("explainer.results.selected_instance")}</h4>
        <Tabs>
          {props.featureNames.map((featureName, index) => (
            <Tab
              key={featureName + index.toString()}
              eventKey={featureName + index.toString()}
              title={featureName}
            >
              <HighchartsReact
                key={featureName + index.toString()}
                ref={(element) => (refs.current[index] = element)}
                highcharts={Highcharts}
                options={specificOptions({
                  title: featureName,
                  data: parameters[index],
                  timestamps: props.data.map((x) => x[0]),
                })}
              />
            </Tab>
          ))}
        </Tabs>
      </>
    );
  }
};
