import React from "react";

import { useTranslation } from "react-i18next";
import { useForm, Control, useController } from "react-hook-form";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { StarIcon, StarFillIcon } from "@primer/octicons-react";

import { api_manager } from "../../api";
import Alert from "react-bootstrap/Alert";

type stars = 1 | 2 | 3 | 4 | 5;

interface UserRatingFormValues {
  rating: stars | null;
  comment: string;
}

export interface UserRatingProps {
  datasetID: number;
  classifierID: string;
  xaiModelName: string;
}

/**
 * Renders the Comment Field under XAI-Explainations
 */
export const UserRating = (props: UserRatingProps) => {
  const {
    control,
    handleSubmit,
    register,
    formState,
  } = useForm<UserRatingFormValues>({
    mode: "onChange",
    defaultValues: {
      rating: null,
      comment: "",
    },
  });

  const [apiResult, setResult] = React.useState<
    { error: null | string } | undefined
  >(undefined);

  const { t } = useTranslation();

  const onSubmit = (values: UserRatingFormValues) => {
    api_manager
      .addRating(
        values.rating!,
        values.comment,
        props.datasetID,
        props.classifierID,
        props.xaiModelName
      )
      .then((response) => {
        setResult({
          error: null,
        });
      })
      .catch((error) => {
        if (error.message) {
          setResult({
            error: error.message,
          });
        } else {
          setResult({
            error: "Internal Error",
          });
        }
      });
  };

  if (apiResult?.error === null) {
    return (
      <Alert variant="success">{t("explainer.results.submit_success")}</Alert>
    );
  } else {
    return (
      <Form onSubmit={handleSubmit(onSubmit)}>
        {apiResult !== undefined && apiResult.error !== null && (
          <Alert variant="danger">{apiResult.error}</Alert>
        )}
        <Form.Group>
          <Form.Label>{t("explainer.results.comment")}</Form.Label>
          <Form.Control
            name="comment"
            as="textarea"
            rows={3}
            ref={register()}
          />
        </Form.Group>
        <StarRating control={control} />
        <Button className="mt-3" type="submit" disabled={!formState.isValid}>
          {t("explainer.results.submitRating")}
        </Button>
      </Form>
    );
  }
};

const StarRating = (props: { control: Control<UserRatingFormValues> }) => {
  const { field } = useController({
    name: "rating",
    control: props.control,
    rules: {
      required: true,
    },
  });

  const FullStar = <StarFillIcon size={24} />;
  const EmptyStar = <StarIcon size={24} />;

  return (
    <div role="radiogroup" title="Rating in Stars">
      {new Array(5).fill(0).map((_x, index) => (
        <span
          key={index}
          onClick={() => field.onChange(index + 1)}
          role="radio"
          title={(index + 1).toString() + " " + (index > 0 ? "Stars" : "Star")}
          aria-checked={field.value === index + 1}
        >
          {field.value >= index + 1 ? FullStar : EmptyStar}
        </span>
      ))}
    </div>
  );
};
