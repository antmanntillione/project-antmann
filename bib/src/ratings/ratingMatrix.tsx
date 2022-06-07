import React from "react";
import Table from "react-bootstrap/Table";

interface RatingMatrixProps {
  xai_models: Array<string>;
  classifiers: Array<string>;
  values: Array<Array<number>>;
}

/**
 * RatingMatrix is a subcomponent of RatingsMenu which indicates how certain combinations
 * of classifiers and XAI models were rated.
 * @param props the available XAI Models, the available classifiers
 * and the values of all classifier-to-XAI-model combinations
 */
export const RatingMatrix = (props: RatingMatrixProps) => {
  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th></th>
          {props.classifiers.map((classifiers: string) => {
            return <th key={classifiers}>{classifiers}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {props.xai_models.map((xai_model: string, xIdx: number) => {
          return (
            <tr key={xai_model}>
              <td>{xai_model}</td>
              {props.values[xIdx].map((value: number, yIdx: number) => {
                return (
                  <td key={yIdx}>{value === 0 ? "-" : value.toFixed(2)}</td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};
