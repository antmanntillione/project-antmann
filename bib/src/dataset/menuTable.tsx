import React from "react";

import {
  DatasetWithClassifier,
  api_manager,
  Classifier,
  DataSetSorting,
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

/**
 * This is the main component of the dataset menu which is made up of a table containing all datasets
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

  const loadDatasets = () => {
    api_manager
      .getDatasets(currentSorting)
      .then((response) => {
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
    if (dataset_type === "timeseries"){
      return t("formFields.datasetType.options.timeseries");
    } else if (dataset_type === "timeseries_georeferenced"){
      return t("formFields.datasetType.options.timeseries_georeferenced");
    } else {
      return t("formFields.datasetType.options.image");
    }
  }

  return (
    <Container className="ml-1" fluid>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>{t("datasets.name")}</th>
            <th>{t("datasets.num_instances")}</th>
            <th>{t("datasets.feature_names")}</th>
            <th>{t("datasets.num_samples")}</th>
            <th>{t("datasets.compatible_classifiers")}</th>
            <th>{t("datasets.upload_date")}</th>
            <th>{t("datasets.dataset_type")}</th>
            <th>{t("datasets.georeferenced")}</th>
          </tr>
        </thead>
        <tbody>
          {datasets.map((dataset: DatasetWithClassifier, index: number) => {
            return (
              <tr key={index}>
                <td>{dataset.name}</td>
                {/* <td>{dataset.num_instances}</td>
                <td>{dataset.feature_names.join(", ")}</td>          
                <td>{dataset.num_samples}</td> */}
                <td>{dataset.additional_params.num_instances}</td>
                <td>{dataset.additional_params?.feature_names ? dataset.additional_params.feature_names.join(", ") : ""}</td>
                <td>{dataset.additional_params.num_samples}</td>
                <td>
                  {dataset.compatible_classifiers
                    .map(([name]: [string, string]) => {
                      return name;
                    })
                    .join(", ")}
                </td>
                <td>{dataset.upload_date}</td>
                <td>{datasetType(dataset.dataset_type)}</td>
                {/* <td>{dataset.geo_referenced && <CheckIcon size={24} />}</td> */}
                <td>{dataset.additional_params.geo_referenced && <CheckIcon size={24} />}</td>
                {is_admin && (
                  <DatasetEditButtons
                    classifiers={classifiers}
                    dataset={dataset}
                    onChangeCompatibility={loadDatasets}
                    onDelete={loadDatasets}
                    onRename={loadDatasets}
                  />
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>
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
    <>
      <td>
        <RenameDataset
          name={props.dataset.name}
          id={props.dataset.id}
          onRename={props.onRename}
        />
      </td>
      <td>
        <ChangeCompability
          classifiers={props.classifiers}
          compatible_classifiers={props.dataset.compatible_classifiers}
          name={props.dataset.name}
          id={props.dataset.id}
          type={props.dataset.dataset_type}
          onChangeCompatibility={props.onChangeCompatibility}
        />
      </td>
      <td>
        <DeleteDataset
          id={props.dataset.id}
          name={props.dataset.name}
          onDelete={props.onDelete}
        />
      </td>
    </>
  );
};
