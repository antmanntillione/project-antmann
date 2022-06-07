import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { api_manager, Rating, RatingView } from "../api";

import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Col";

interface RatingTableProps {
  table_length: number;
  rating_view: RatingView;
  total_ratings: number;
}

/**
 * RatingTable is a subcomponent of RatingsMenu which displays all ratings in ascending order regarding their upload-date.
 * @param props the table length (amount of ratings displayed per table page),
 *  the current perspective (i.e. are all ratings displayed or just the ones submitted by the current user?),
 * total_ratings (i.e. the total number of ratings regarding the current scope)
 */
export const RatingTable = (props: RatingTableProps) => {
  const [current_page, set_page] = React.useState(0);
  const [ratings, set_ratings] = React.useState<Array<Rating>>([]);

  useEffect(() => {
    api_manager
      .getRatings(
        current_page * props.table_length,
        props.table_length,
        props.rating_view
      )
      .then((response) => {
        set_ratings(response);
      })
      .catch((error) => {
        alert(error);
      });
  }, [props.table_length, props.rating_view, current_page]);

  const { t } = useTranslation();

  return (
    <div>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>{t("ratings.xai_model")}</th>
            <th>{t("ratings.classifier")}</th>
            <th>{t("ratings.dataset")}</th>
            <th>{t("ratings.creator")}</th>
            <th>{t("ratings.rating")}</th>
            <th>{t("ratings.comment")}</th>
          </tr>
        </thead>
        <tbody>
          {ratings.map((rating: Rating, index: number) => {
            return (
              <tr key={index}>
                <td>{rating.xai_model}</td>
                <td>{rating.classifier}</td>
                <td>{rating.dataset}</td>
                <td>{rating.creator}</td>
                <td>{rating.rating}</td>
                <td>{rating.comment}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Pagination
        style={{
          float: "left",
        }}
      >
        {[...Array(Math.ceil(props.total_ratings / props.table_length))].map(
          (_, i) => (
            <Pagination.Item
              key={i + 1}
              active={current_page === i}
              onClick={() => set_page(i)}
            >
              {i + 1}
            </Pagination.Item>
          )
        )}
      </Pagination>
      <Button
        style={{
          float: "right",
        }}
        onClick={() => {
          api_manager.getRatingCSV();
        }}
      >
        {t("ratings.csv")}
      </Button>
    </div>
  );
};
