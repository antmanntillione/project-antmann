import React from "react";
import { QuickStatsView } from "./ratingQuickStats";
import { api_manager, RatingStatistic, RatingView } from "../api";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { RatingTable } from "./ratingTable";
import { useTranslation } from "react-i18next";
import { RatingMatrix } from "./ratingMatrix";

/**
 * This is the main component of the RatingsMenu which contains all subcomponents
 * like the RatingQuickStats, the RatingMatrix and the RatingTable.
 */
export const RatingsMenu = () => {
  const { t } = useTranslation();

  const [statistic, set_statistic] = React.useState<RatingStatistic>({
    number_of_ratings: 0,
    average_rating: 0,
    number_of_users: 0,
    rating_matrix: {
      xai_models: [],
      classifiers: [],
      values: [],
    },
  });

  const [current_view, set_view] = React.useState<RatingView>("user");

  React.useEffect(() => {
    api_manager
      .getStatistics(current_view)
      .then((response) => {
        const new_statistics: RatingStatistic = response;
        set_statistic(new_statistics);
      })
      .catch((error) => {
        alert(error);
      });
  }, [current_view]);

  let change_view_text: string;

  if (current_view === "all") {
    change_view_text = t("ratings.change_view_to_user");
  } else {
    change_view_text = t("ratings.change_view_to_global");
  }

  return (
    <Container fluid>
      <Row>
        <Col md={4}>
          <h2>{t("ratings.statistics")}</h2>
          <QuickStatsView
            number_of_ratings={statistic.number_of_ratings}
            number_of_users={statistic.number_of_users}
            average_rating={statistic.average_rating}
          />
          <h2 className="mt-5">{t("ratings.average_ratings_matrix")}</h2>
          <RatingMatrix
            xai_models={statistic.rating_matrix.xai_models}
            classifiers={statistic.rating_matrix.classifiers}
            values={statistic.rating_matrix.values}
          />
          <Button
            onClick={() => {
              if (current_view === "user") {
                set_view("all");
              } else {
                set_view("user");
              }
            }}
          >
            {change_view_text}
          </Button>
        </Col>

        <Col md={8}>
          <h2>{t("ratings.all_ratings")}</h2>
          <RatingTable
            key={current_view}
            table_length={10}
            rating_view={current_view}
            total_ratings={statistic.number_of_ratings}
          />
        </Col>
      </Row>
    </Container>
  );
};
