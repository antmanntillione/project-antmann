import React from "react";

import { useTranslation } from "react-i18next";

interface QuickStatsProps {
  number_of_ratings: number;
  average_rating: number;
  number_of_users: number;
}

/**
 * RatingQuickStats is a subcomponent of RatingsMenu contains a small statistic about the number of
 * ratings submitted (of all users or of the current user), the average_rating of all currently considered ratings
 * (all ratings or just the current user's ratings) and the number of users that have submitted a rating (also depending on the scope).
 * @param props the number of ratings, the average rating, and the number of raters considering the current scope.
 */
export const QuickStatsView = (props: QuickStatsProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <StatisticItem
        name={t("ratings.numberOfRatings")}
        value={props.number_of_ratings.toString()}
      />
      <br />
      <StatisticItem
        name={t("ratings.numberOfRaters")}
        value={props.number_of_users.toString()}
      />
      <br />
      <StatisticItem
        name={t("ratings.averageRating")}
        value={props.average_rating.toFixed(2)}
      />
      <br />
    </div>
  );
};

const StatisticItem = (props: { name: string; value: string }) => {
  return (
    <p style={{ display: "inline" }}>
      <strong>{props.name}: </strong>
      {props.value}
    </p>
  );
};
