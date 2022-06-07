import React from "react";
import { Dataset } from "../api/api_types";
import Row from "react-bootstrap/Row";
import timeseries_georeferenced_pic from "../resources/timeseries_georeferenced.jpg";
import image_pic from "../resources/image.jpg";
import timeseries_pic from "../resources/timeseries.png";
import { useTranslation } from "react-i18next";
import { ExplainerCard } from "../util";
import { api_manager } from "../api";

import { ExplainerParameters } from "./ExplainerMenu";
import { useController, Control, useWatch } from "react-hook-form";
import { AISVisualizer } from "./visualizers/AIS";

/**
 * This renders the dataset selection section
 */
export const DatasetSelection = (props: {
  control: Control<ExplainerParameters>;
  setValue(name: string, value: any): void;
  initialClassifier: ExplainerParameters["classifier"];
}) => {
  const { t } = useTranslation();

  const { field } = useController({
    name: "dataset",
    control: props.control,
    rules: {
      required: true,
    },
  });

  const classifier = useWatch<ExplainerParameters["classifier"]>({
    control: props.control,
    name: "classifier",
    defaultValue: props.initialClassifier,
  });

  const [datasets, setDatasets] = React.useState<Array<Dataset>>([]);

  const idEqual = (searched_id: number) => {
    return (model: Dataset) => {
      return model.id === searched_id;
    };
  };

  React.useEffect(() => {
    if (!classifier) {
      api_manager
        .getDatasets("sort_by_name")
        .then((response) => {
          const new_datasets: Array<Dataset> = response;
          setDatasets(new_datasets);
        })
        .catch((error) => {
          alert(error);
        });
    } else {
      setDatasets(classifier.datasets);
      if (field.value) {
        //Make sure the previous selection is still valid
        if (classifier.datasets.findIndex(idEqual(field.value.id)) === -1) {
          field.onChange(null);
          props.setValue("instance", 0);
        }
      }
    }
  }, [classifier]);

  
  return (
    <Row>
      {datasets.map((dataset: Dataset) => {
        let cardImage;
        if (
          dataset.dataset_type === "timeseries" ||
          dataset.dataset_type === "timeseries_georeferenced"
        ) {
          if (dataset.dataset_type === "timeseries_georeferenced") {
            cardImage = timeseries_georeferenced_pic;
          } else {
            cardImage = timeseries_pic;
          }
          return (
            <ExplainerCard
              clickable={field.value !== dataset}
              key={dataset.id}
              min_width="18rem"
              active={field.value === dataset}
              enabled={classifier !== null}
              onSelect={() => {
                props.setValue("instance", 0);
                props.setValue(
                  "instance_amount",
                  dataset.additional_params.num_instances > 10
                    ? 10
                    : dataset.additional_params.num_instances
                );
                field.onChange(dataset);
              }}
            >
              <ExplainerCard.Img
                variant="top"
                src={cardImage}
                width=""
                height="180px"
              />
              <ExplainerCard.Body>
                <ExplainerCard.Title>{dataset.name}</ExplainerCard.Title>
                <ExplainerCard.Subtitle>
                  {t("datasets.dataset_type")}
                </ExplainerCard.Subtitle>
                <ul>
                  <li>{dataset.dataset_type}</li>
                </ul>
                <ExplainerCard.Subtitle>
                  {t("datasets.num_instances") +
                    " * " +
                    t("datasets.num_samples")}
                </ExplainerCard.Subtitle>
                <ul>
                  <li>
                    {dataset.additional_params.num_instances +
                      " * " +
                      dataset.additional_params.num_samples}
                  </li>
                </ul>
                <ExplainerCard.Subtitle>
                  {t("datasets.feature_names")}
                </ExplainerCard.Subtitle>
                <ul>
                  {
                    <li>
                      {dataset.additional_params.feature_names.join(", ")}
                    </li>
                  }
                </ul>
                <ExplainerCard.Subtitle>
                  {t("datasets.upload_date")}
                </ExplainerCard.Subtitle>
                <ul>
                  <li>{dataset.upload_date}</li>
                </ul>
              </ExplainerCard.Body>
            </ExplainerCard>
          );
        } else if (dataset.dataset_type === "image") {
          return (
            <ExplainerCard
              clickable={field.value !== dataset}
              key={dataset.id}
              min_width="18rem"
              active={field.value === dataset}
              enabled={classifier !== null}
              onSelect={() => {
                props.setValue("instance", 0);
                // props.setValue(
                //   "instance_amount",
                //   dataset.additional_params.num_instances > 10 ? 10 : dataset.additional_params.num_instances
                // );
                field.onChange(dataset);
              }}
            >
              <ExplainerCard.Img
                variant="top"
                src={image_pic}
                width=""
                height="180px"
              />
              <ExplainerCard.Body>
                <ExplainerCard.Title>{dataset.name}</ExplainerCard.Title>
                <ExplainerCard.Subtitle>
                  {t("datasets.dataset_type")}
                </ExplainerCard.Subtitle>
                <ul>
                  <li>{dataset.dataset_type}</li>
                </ul>
                <ExplainerCard.Subtitle>
                  {t("datasets.num_instances")}
                </ExplainerCard.Subtitle>
                <ul>
                  <li>{dataset.additional_params.num_instances}</li>
                </ul>
                <ExplainerCard.Subtitle>
                  {t("datasets.feature_names")}
                </ExplainerCard.Subtitle>
                <ul>
                  {dataset.additional_params?.feature_names
                    ? dataset.additional_params.feature_names.map(
                        (feature: string) => {
                          return <li key={feature}>{feature}</li>;
                        }
                      )
                    : ""}
                </ul>
                <ExplainerCard.Subtitle>
                  {t("datasets.num_samples")}
                </ExplainerCard.Subtitle>
                <ul>
                  <li>{dataset.additional_params.num_samples}</li>
                </ul>
              </ExplainerCard.Body>
            </ExplainerCard>
          );
        } else {
          return <> </>;
        }
      })}
    </Row>
  );
};
