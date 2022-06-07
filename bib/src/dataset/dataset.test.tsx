import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { Classifier, DatasetWithClassifier, User } from "../api/api_types";

import { DatasetMenu } from "./menu";
import i18n from "../i18n/config";
import { api_manager } from "../api/";
import { I18nextProvider } from "react-i18next";
import { AuthContext } from "../login";

const mockClassifiers: Array<Classifier> = [
  {
    name: "knn_ecg",
    uuid: "458aa776-1431-4dfb-85ff-c5c79388576d",
    framework: "SciKit",
    xai_models: [
      {
        name: "LimeForTime",
        uuid: "04aa78d8-6039-431d-b418-bf99bbee2ada",
        local: true,
        global: false,
        parameters: [
          {
            name: "replacement_method",
            type: "choice",
            description: {
              choices: ["mean", "noise", "total_mean"],
              default: "mean",
            },
          },
        ],
      },
    ],
    datasets: [
      {
        name: "networkLoadBerlin",
        id: 537,
        num_instances: 1,
        feature_names: ["frequency"],
        num_samples: 96,
        upload_date: "03.09.2020",
        geo_referenced: false,
      },
    ],
  },
  {
    name: "ResNet-360",
    uuid: "fe7c1604-489a-4bf4-9467-079d262bcd8c",
    framework: "Tensorflow",
    xai_models: [
      {
        name: "SHAP Deep Explainer",
        uuid: "3d75159a-931a-4981-9d56-fcdbb6cfb9d9",
        local: true,
        global: true,
        parameters: [
          {
            name: "background_data",
            type: "int",
            description: {
              min: 1000,
              max: 5000,
              step: 100,
              default: 1000,
            },
          },
        ],
      },
      {
        name: "SHAP Gradient Explainer",
        uuid: "63b3b47d-605b-4b2f-a3cc-5fd08b636910",
        local: true,
        global: true,
        parameters: [
          {
            name: "background_data",
            type: "int",
            description: {
              min: 1000,
              max: 5000,
              step: 100,
              default: 2000,
            },
          },
        ],
      },
      {
        name: "LimeForTime",
        uuid: "4df858d8-ef0f-4345-a46d-3dc986c27b1f",
        local: true,
        global: false,
        parameters: [
          {
            name: "replacement_method",
            type: "choice",
            description: {
              choices: ["mean", "noise", "total_mean"],
              default: "noise",
            },
          },
        ],
      },
      {
        name: "PIG",
        uuid: "70e32911-4d7a-46da-910a-9db3c41c8da7",
        local: true,
        global: true,
        parameters: [
          {
            name: "bist du fly wie adler",
            type: "choice",
            description: {
              choices: ["no", "yeah brrr"],
              default: "yeah brrr",
            },
          },
        ],
      },
      {
        name: "SHAP Kernel Explainer",
        uuid: "70e32911-4d7a-46da-910a-9db3c41c8da8",
        local: true,
        global: false,
        parameters: [],
      },
    ],
    datasets: [
      {
        name: "ShipDataBritanny2019",
        id: 352,
        num_instances: 4,
        feature_names: ["mmsi", "lon", "lat", "timediff", "course", "speed"],
        num_samples: 320,
        upload_date: "12.12.2020",
        geo_referenced: true,
      },
      {
        name: "ShipDataBritanny2020",
        id: 354,
        num_instances: 5000,
        feature_names: ["mmsi", "lon", "lat", "timediff", "course", "speed"],
        num_samples: 320,
        upload_date: "13.12.2020",
        geo_referenced: true,
      },
    ],
  },
];

const mockDatasets: Array<DatasetWithClassifier> = [
  {
    name: "ShipDataBritanny2019",
    id: 352,
    num_instances: 4,
    feature_names: [
      "distance_to_harbor",
      "speed",
      "course_over_ground",
      "x_global",
      "y_global",
    ],
    num_samples: 320,
    compatible_classifiers: [
      ["ResNet-360", "fe7c1604-489a-4bf4-9467-079d262bcd8c"],
    ],
    upload_date: "12.12.2020",
    geo_referenced: true,
  },
  {
    name: "networkLoadBerlin",
    id: 537,
    num_instances: 64,
    feature_names: ["frequency", "load"],
    num_samples: 320,
    compatible_classifiers: [
      ["knn_ecg", "458aa776-1431-4dfb-85ff-c5c79388576d"],
    ],
    upload_date: "03.09.2020",
    geo_referenced: false,
  },
];

export const mockInstanceNames: Array<[string, number]> = [
  ["100896616", 0],
  ["100907260", 1],
  ["200660214", 2],
  ["203999427", 3],
];

const mockUser: User = {
  username: "Alice_w2065",
  id: 43097269,
  language: "english",
  privilege_level: "ADMIN",
};
const mockUserContext: AuthContext = {
  user: mockUser,
  setUser: (user: User) => {},
};
const mockGetDatasets = (api_manager.getDatasets = jest.fn());
const mockGetClassifiers = (api_manager.getClassifiers = jest.fn());
const mockRenameDataset = (api_manager.setDatasetName = jest.fn());
jest.mock("../login", () => ({ useAuth: () => mockUserContext }));
it("Dataset menu", async () => {
  mockGetDatasets.mockResolvedValueOnce(mockDatasets);
  mockGetClassifiers.mockResolvedValueOnce(mockClassifiers);
  mockRenameDataset.mockResolvedValueOnce(null);
  //Check if rendering works
  render(
    <I18nextProvider i18n={i18n}>
      <DatasetMenu is_admin />
    </I18nextProvider>
  );
  await waitFor(() => expect(mockGetDatasets).toHaveBeenCalledTimes(1));
  //Check if correct contents are shown on screen
  await screen.findByText("Georeferenced");
  await screen.findByText("ShipDataBritanny2019");
  await screen.findByText("Number of instances");

  //check if opening upload dialogue works
  const uploadDialogueButton = await screen.findByTestId("uploadButton");
  fireEvent.click(uploadDialogueButton);
  const datasetName = await screen.findByTestId("name");
  fireEvent.change(datasetName, { target: { value: "abcdef" } });
  const features = await screen.findByTestId("featureNames");
  fireEvent.change(features, { target: { value: "a,b" } });
  const confirmUpload = await screen.findByTestId("confirmUpload");
  expect(confirmUpload).toBeDisabled();
  //check if closing dialogue works
  const closeButton = await screen.findByTestId("closeButton");
  fireEvent.click(closeButton);

  //check if opening rename dialogue works
  const renameButton = await screen.findByTestId("renamenetworkLoadBerlin");
  fireEvent.click(renameButton);
  const newDatasetName = await screen.findByRole("textbox");
  fireEvent.change(newDatasetName, { target: { value: "TestDatasetName" } });
  mockDatasets[1].name = "TestDatasetName";
  mockGetDatasets.mockResolvedValueOnce(mockDatasets.map((x) => x));
  const confirmName = await screen.findByTestId("confirmRename");
  fireEvent.click(confirmName);
  await waitFor(() => expect(mockGetDatasets).toHaveBeenCalled());
  await screen.findByText("TestDatasetName");

  //check if opening change compatibility dialogue works
  const openDeleteButton = await screen.findByTestId("deleteTestDatasetName");
  fireEvent.click(openDeleteButton);
  const confirmDeletion = await screen.findByTestId("confirmDeletion");
  expect(confirmDeletion).toBeDisabled();
  const deleteDatasetName = await screen.findByTestId("name");
  fireEvent.change(deleteDatasetName, { target: { value: "TestDatasetName" } });
  mockDatasets.pop();
  mockGetDatasets.mockResolvedValueOnce(mockDatasets.map((x) => x));
  fireEvent.click(confirmDeletion);
  await waitFor(() => expect(mockGetDatasets).toHaveBeenCalled());

  //check if opening change compatibility dialogue works
  const changeCompButton = await screen.findByTestId(
    "changecompShipDataBritanny2019"
  );
  fireEvent.click(changeCompButton);
  //const resnet = await screen.findByTestId("classifierResNet-360");
  const knn = await screen.findByTestId("classifierknn_ecg");
  //fireEvent.click(resnet);
  fireEvent.click(knn);
  //mockDatasets[0].compatible_classifiers.pop();
  mockDatasets[0].compatible_classifiers.push([
    "knn_ecg",
    "458aa776-1431-4dfb-85ff-c5c79388576d",
  ]);
  mockGetDatasets.mockResolvedValueOnce(mockDatasets);
  const submitButton = await screen.findByTestId("submitComp");
  //expect(submitButton).toBeDisabled();
  fireEvent.click(submitButton);
  await waitFor(() => expect(mockGetDatasets).toHaveBeenCalled());
});
