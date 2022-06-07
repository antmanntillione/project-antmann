import React from "react";
import Row from "react-bootstrap/Row";
import timeseries_georeferenced_pic from "../resources/timeseries_georeferenced.jpg";
import image_pic from "../resources/image.jpg";
import timeseries_pic from "../resources/timeseries.png";

import {
  DatasetWithClassifier,
  api_manager,
  Classifier,
  DataSetSorting,
  Dataset,
} from "../api";

import { UploadMenu } from "./UploadDataset";

import Button from "react-bootstrap/Button";

import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";

import { useTranslation } from "react-i18next";

import { ChangeCompability } from "./ChangeCompability";
import { DeleteDataset } from "./DeleteDataset";
import { RenameDataset } from "./RenameDataset";

import { CheckIcon } from "@primer/octicons-react";
import { useAuth } from "../login";

import { ExplainerCard } from "../util";
import { ButtonToolbar } from "react-bootstrap";

/**
 * This is the main component of the dataset menu which is made up of cards containing all datasets
 * with buttons to modify them as well as the option to upload a new dataset.
 * @param param0 determines whether or not the current user is an admin as
 * only admins are allowed to modify datasets
 */
export const DatasetMenu = ({ is_admin = false }: { is_admin?: boolean }) => {
  const { t } = useTranslation();
  const user = useAuth().user;

  const [currentSorting, setSorting] = React.useState<DataSetSorting>(
    "sort_by_name"
  );
  const [datasets, set_datasets] = React.useState<Array<DatasetWithClassifier>>(
    []
  );
  const [classifiers, set_classifiers] = React.useState<Array<Classifier>>([]);

  // Dummy image dataset metadata to test the Datasets Menu
  // let imageDatasetDummy: DatasetWithClassifier = {
  //   "name": "Image dataset",
  //   "id": 5,
  //   "upload_date": "17.08.2021",
  //   "dataset_type": "image",
  //   "additional_params": {
  //     "num_images": 100,
  //   },
  //   "compatible_classifiers": [],
  // }

  const loadDatasets = () => {
    api_manager
      .getDatasets(currentSorting)
      .then((response) => {
        // response.push(imageDatasetDummy); // Dummy: must be removed later
        set_datasets(response);
      })
      .catch((error) => {
        alert(error);
      });
  };

  const loadClassifiers = () => {
    api_manager
      .getClassifiers()
      .then((response: Array<Classifier>) => {
        set_classifiers(response);
      })
      .catch((error) => {
        alert(error);
      });
  };

  React.useEffect(loadDatasets, [currentSorting]);

  React.useEffect(loadClassifiers, []);

  const changeSortingText = React.useMemo(() => {
    if (currentSorting === "sort_by_name") {
      return t("datasets.sort_by_data");
    } else {
      return t("datasets.sort_by_name");
    }
  }, [currentSorting, t]);

  // function to return the suitable text (EN/DE) of dataset_type, which is then displayed on the table
  const datasetType = (dataset_type: string): string => {
    if (dataset_type === "timeseries") {
      return t("formFields.datasetType.options.timeseries");
    } else if (dataset_type === "timeseries_georeferenced") {
      return t("formFields.datasetType.options.timeseries_georeferenced");
    } else {
      return t("formFields.datasetType.options.image");
    }
  };

  return (
    <Container className="pt-3" fluid>
      <Row>
        {datasets.map((dataset: DatasetWithClassifier, index: number) => {
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
                clickable={false}
                key={index}
                min_width="18rem"
                active={false}
                enabled={true}
                onSelect={() => {}}
              >
                <ExplainerCard.Img
                  variant="top"
                  src={cardImage}
                  width=""
                  height="180px"
                />
                <ExplainerCard.Body>
                  <ExplainerCard.Title>
                    {" "}
                    {/* className="text-left" */}
                    {dataset.name}
                  </ExplainerCard.Title>
                  <ExplainerCard.Subtitle>
                    {t("datasets.dataset_type")}
                  </ExplainerCard.Subtitle>
                  <ul>
                    <li>{dataset.dataset_type}</li>
                  </ul>
                  <ExplainerCard.Subtitle>
                    {t("datasets.compatible_classifiers")}
                  </ExplainerCard.Subtitle>
                  <ul>
                    {
                      <li>
                        {dataset.compatible_classifiers
                          .map(([name]: [string, string]) => {
                            return name;
                          })
                          .join(", ")}
                      </li>
                    }
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
                  {is_admin && (
                    <DatasetEditButtons
                      classifiers={classifiers}
                      dataset={dataset}
                      onChangeCompatibility={loadDatasets}
                      onDelete={loadDatasets}
                      onRename={loadDatasets}
                    />
                  )}
                </ExplainerCard.Body>
              </ExplainerCard>
            );
          } else if (dataset.dataset_type === "image") {
            return (
              <ExplainerCard
                clickable={false}
                key={index}
                min_width="18rem"
                active={false}
                enabled={true}
                onSelect={() => {}}
              >
                <ExplainerCard.Img
                  variant="top"
                  src={image_pic}
                  width="100%"
                  height="180px"
                />
                <ExplainerCard.Body>
                  <ExplainerCard.Title>
                    {" "}
                    {/* className="text-center" */}
                    {dataset.name}
                  </ExplainerCard.Title>
                  <ExplainerCard.Subtitle>
                    {t("datasets.dataset_type")}
                  </ExplainerCard.Subtitle>
                  <ul>
                    <li>{dataset.dataset_type}</li>
                  </ul>
                  <ExplainerCard.Subtitle>
                    {t("datasets.num_images")}
                  </ExplainerCard.Subtitle>
                  <ul>
                    <li>{dataset.additional_params?.num_images}</li>
                  </ul>
                  <ExplainerCard.Subtitle>
                    {t("datasets.compatible_classifiers")}
                  </ExplainerCard.Subtitle>
                  <ul>
                    {
                      <li>
                        {dataset.compatible_classifiers
                          .map(([name]: [string, string]) => {
                            return name;
                          })
                          .join(", ")}
                      </li>
                    }
                  </ul>
                  <ExplainerCard.Subtitle>
                    {t("datasets.upload_date")}
                  </ExplainerCard.Subtitle>
                  <ul>
                    <li>{dataset.upload_date}</li>
                  </ul>
                  {is_admin && (
                    <DatasetEditButtons
                      classifiers={classifiers}
                      dataset={dataset}
                      onChangeCompatibility={loadDatasets}
                      onDelete={loadDatasets}
                      onRename={loadDatasets}
                    />
                  )}
                </ExplainerCard.Body>
              </ExplainerCard>
            );
          } else {
            return <> </>;
          }
        })}
      </Row>

      <Button
        className="mr-3"
        onClick={() => {
          if (currentSorting === "sort_by_name") {
            setSorting("sort_by_upload_date");
          } else {
            setSorting("sort_by_name");
          }
        }}
      >
        {changeSortingText}
      </Button>
      {user?.privilege_level === "ADMIN" && (
        <UploadMenu onUpload={loadDatasets} />
      )}
    </Container>
  );
};

const DatasetEditButtons = (props: {
  dataset: DatasetWithClassifier;
  classifiers: Array<Classifier>;
  onRename(): void;
  onChangeCompatibility(): void;
  onDelete(): void;
}) => {
  return (
    <div className="container">
      <div className="row" style={{ textAlign: "center" }}>
        <div className="col">
          <RenameDataset
            name={props.dataset.name}
            id={props.dataset.id}
            onRename={props.onRename}
          />
        </div>

        <div className="col">
          <ChangeCompability
            classifiers={props.classifiers}
            compatible_classifiers={props.dataset.compatible_classifiers}
            name={props.dataset.name}
            id={props.dataset.id}
            type={props.dataset.dataset_type}
            onChangeCompatibility={props.onChangeCompatibility}
          />
        </div>

        <div className="col">
          <DeleteDataset
            id={props.dataset.id}
            name={props.dataset.name}
            onDelete={props.onDelete}
          />
        </div>
      </div>
    </div>
  );
};
