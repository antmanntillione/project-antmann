import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { api_manager } from "../api";
import i18n from "../i18n/config";
import { RatingsMenu } from "./menu";
import { I18nextProvider } from "react-i18next";
import { act } from "react-dom/test-utils";

import { Rating, RatingStatistic } from "../api/api_types";

const mock_statistic_local: RatingStatistic = {
  number_of_ratings: 8,
  average_rating: 4,
  number_of_users: 1,
  rating_matrix: {
    xai_models: ["SHAP Kernel Explainer", "SHAP Deep", "LimeForTime"],
    classifiers: ["ConvNet360", "ResNet-420", "skylink"],
    values: [
      [3.0, 4.0, 2.0],
      [1.3, 2.7, 3.6],
      [4.2, 5.0, 4.1],
    ],
  },
};

const mock_ratings: Array<Rating> = [
  {
    creator: "Max Mustermann",
    comment: "Sehr nice",
    rating: 3,
    dataset: "Brittany",
    classifier: "ConvNet360",
    xai_model: "SHAP Kernel Explainer",
  },
  {
    creator: "Erik Andre",
    comment: "Ich kann hier auch längere Sachen schreiben wenn ich will lel",
    rating: 4,
    dataset: "Brittany",
    classifier: "ConvNet360",
    xai_model: "SHAP Kernel Explainer",
  },
  {
    creator: "Max Mustermann",
    comment: "Sehr nice",
    rating: 3,
    dataset: "Brittany",
    classifier: "ConvNet360",
    xai_model: "Ein sehr langes XAI Model was bestimmt ein cooles Akronym hat",
  },
  {
    creator: "Max Mustermann",
    comment: "Sehr nice",
    rating: 3,
    dataset: "Brittany",
    classifier:
      "Ein sehr langer Classifier welcher auch bestimmt einen schönen Namen hat",
    xai_model: "SHAP Kernel Explainer",
  },
  {
    creator: "Max Mustermann",
    comment: "Sehr nice",
    rating: 1,
    dataset: "Brittany",
    classifier: "ConvNet360",
    xai_model: "SHAP Kernel Explainer",
  },
  {
    creator: "Max Mustermann",
    comment: "Sehr nice",
    rating: 5,
    dataset: "Brittany",
    classifier: "ConvNet360",
    xai_model: "SHAP Kernel Explainer",
  },
  {
    creator: "Max Mustermann",
    comment: "Sehr nice",
    rating: 4,
    dataset: "Brittany",
    classifier: "ConvNet360",
    xai_model: "SHAP Kernel Explainer",
  },
  {
    creator: "Max Mustermann",
    comment: "Sehr nice",
    rating: 2,
    dataset: "Brittany",
    classifier: "ResNet420",
    xai_model: "SHAP Kernel Explainer",
  },
  {
    creator: "Max Mustermann",
    comment: "ganz nice",
    rating: 2,
    dataset: "Brittany",
    classifier: "ConvNet360",
    xai_model: "SHAP Kernel Explainer",
  },
  {
    creator: "Ella Sux",
    comment: "wenig nice",
    rating: 2,
    dataset: "Brittany",
    classifier: "ConvNet360",
    xai_model: "SHAP Kernel Explainer",
  },
  {
    creator: "Sebastian Okrates",
    comment: "bitte nicht",
    rating: 3,
    dataset: "kein",
    classifier: "la",
    xai_model: "mehr :(",
  },
  {
    creator: "Dominik Albert Solomon Ende",
    comment: "Klappe",
    rating: 1,
    dataset: "affe",
    classifier: "tot",
    xai_model: "das wars",
  },
];

const mockApiRatings: Array<Rating> = mock_ratings;
const mockApiStats: RatingStatistic = mock_statistic_local;
const mockGetRatings = (api_manager.getRatings = jest.fn());
const mockGetStats = (api_manager.getStatistics = jest.fn());
it("Ratings menu", async () => {
  mockGetStats.mockResolvedValue(mockApiStats);
  mockGetRatings.mockResolvedValue(mockApiRatings);
  //Check if rendering works
  render(
    <I18nextProvider i18n={i18n}>
      <RatingsMenu />
    </I18nextProvider>
  );
  await waitFor(() => expect(mockGetRatings).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(mockGetStats).toHaveBeenCalledTimes(1));
  //Check if correct contents are shown on screen
  await screen.findByText("Statistics");
  await screen.findByText("Average Ratings");
  await screen.findByText("User Ratings");
  //check if toggling view works
  const toggleRatingsButton = await screen.findByRole("button", {
    name: "View all Ratings",
  });
  fireEvent.click(toggleRatingsButton);
  await screen.findByText("View own Ratings");
});
