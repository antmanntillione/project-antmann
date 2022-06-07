import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

import { Step } from "../util";
import { ClassifierSelection } from "./ClassifierMenu";
import { XAIModelSelection } from "./XAIModelSelection";
import { GlobalLocalSelection } from "./GlobalLocalSelection";
import { DatasetSelection } from "./DatasetSelection";
import { InstanceSelection } from "./InstanceSelectionMenu";
import { ParameterConfiguration } from "./ParameterConfiguration";
import { useTranslation } from "react-i18next";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { ErrorMessage } from "@hookform/error-message";
import { ExplainerParameters } from "./ExplainerMenu";

import { useForm } from "react-hook-form";

import { ImageSelection } from "./visualizers/ImageSelection";

/**
 * This is the Main Entry Point for the Job Configurator
 * Additionally it manages the Form State
 */
export const OptionsConfigurator = (props: {
  initialValues: ExplainerParameters | null;
  onSubmit(values: ExplainerParameters): void;
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    errors,
    getValues,
  } = useForm<ExplainerParameters>({
    defaultValues: props.initialValues
      ? props.initialValues
      : {
          classifier: null,
          global_local: null,
          xai_models: [],
          dataset: null,
          instance_amount: 0,
          instance: 0,
        },
  });

  const { t } = useTranslation();
  return (
    <Form onSubmit={handleSubmit<ExplainerParameters>(props.onSubmit)}>
      <Row>
        <Col>
          <Step title={t("explainer.classifier.title")} />
          <ErrorMessage
            errors={errors}
            name="classifier"
            message={t("explainer.classifier.error")}
            as={<Alert variant="danger" />}
          />
          <ClassifierSelection control={control} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Step title={t("explainer.dataset.title")} />
          <ErrorMessage
            errors={errors}
            name="dataset"
            message={t("explainer.dataset.error")}
            as={<Alert variant="danger" />}
          />
          <DatasetSelection
            control={control}
            setValue={setValue}
            initialClassifier={getValues("classifier")}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Step title={t("explainer.global_local.title")} />
          <ErrorMessage
            errors={errors}
            name="global_local"
            message={t("explainer.global_local.error")}
            as={<Alert variant="danger" />}
          />
          <GlobalLocalSelection
            control={control}
            initialClassifier={getValues("classifier")}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Step title={t("explainer.instance.title")} />
          <InstanceSelection
            control={control}
            initialGlobalLocal={getValues("global_local")}
            initialDataset={getValues("dataset")}
            initialInstance={getValues("instance")}
            initialInstanceAmount={getValues("instanceAmount")}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Step title={t("explainer.xai_model.title")} />
          <ErrorMessage
            errors={errors}
            name="xai_models"
            message={t("explainer.xai_model.error")}
            as={<Alert variant="danger" />}
          />
          <XAIModelSelection
            control={control}
            initialClassifier={getValues("classifier")}
            initialGlobalLocal={getValues("global_local")}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Step title={t("explainer.parameter.title")} />
          <ParameterConfiguration
            control={control}
            initialXaiModels={getValues("xai_models")}
          />
        </Col>
      </Row>
      <Button size="lg" type="submit">
        {t("explainer.run_explainer")}
      </Button>
    </Form>
  );
};
