import React from "react";
import { ParameterDescription, XAIModel } from "../api";

import Form from "react-bootstrap/Form";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import { ExplainerParameters } from "./ExplainerMenu";
import { Control, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

/**
 * The Parameter Configurator to configurate the XAI-Model Parameters
 */
export const ParameterConfiguration = (props: {
  control: Control<ExplainerParameters>;
  initialXaiModels: Array<XAIModel>;
}) => {
  const xai_models = useWatch<ExplainerParameters["xai_models"]>({
    control: props.control,
    name: "xai_models",
    defaultValue: props.initialXaiModels,
  });

  const required = React.useMemo(() => {
    for (const xai_model of xai_models) {
      if (xai_model.parameters.length > 0) {
        return true;
      }
    }
    return false;
  }, [xai_models]);

  return (
    <Tabs transition={false} style={!required ? { display: "none" } : {}}>
      {xai_models
        .filter((model) => model.parameters.length > 0)
        .map((model: XAIModel) => (
          <Tab
            eventKey={model.uuid}
            title={model.name}
            key={model.uuid}
            className="mt-3"
            style={{ maxWidth: "45rem" }}
          >
            <ModelParameterConfigurator
              parameters={model.parameters}
              uuid={model.uuid}
              control={props.control}
            />
          </Tab>
        ))}
    </Tabs>
  );
};

const ModelParameterConfigurator = (props: {
  parameters: Array<ParameterDescription>;
  uuid: string;
  control: Control<ExplainerParameters>;
}) => {
  return (
    <>
      {props.parameters.map((description: ParameterDescription) => {
        const fieldName = `parameter[${props.uuid}][${description.name}]`;

        if (description.type === "choice") {
          return (
            <ChoiceParameterConfiguration
              key={description.name}
              parameterName={description.name}
              defaultSelection={description.description.default}
              options={description.description.choices}
              control={props.control}
              formName={fieldName}
            />
          );
        } else if (description.type === "int") {
          return (
            <IntegerParameterConfigurator
              key={description.name}
              parameterName={description.name}
              defaultValue={description.description.default}
              min={description.description.min}
              max={description.description.max}
              step={description.description.step}
              control={props.control}
              formName={fieldName}
            />
          );
        }

        return <></>;
      })}
    </>
  );
};

const IntegerParameterConfigurator = (props: {
  parameterName: string;
  formName: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  control: Control<ExplainerParameters>;
}) => {
  const { t, i18n } = useTranslation();

  const value = useWatch({
    control: props.control,
    name: props.formName,
  });

  return (
    <>
      <Form.Group>
        <Form.Label>
          <h6>
            {props.parameterName}: {value ? value : props.defaultValue}
          </h6>
        </Form.Label>
        <Form.Control
          type="range"
          name={props.formName}
          min={props.min}
          max={props.max}
          step={props.step}
          defaultValue={props.defaultValue}
          ref={props.control.register({
            required: true,
            valueAsNumber: true,
          })}
        />
        {i18n.exists("explainer.parameter." + props.parameterName) &&
          t("explainer.parameter." + props.parameterName)}
      </Form.Group>
    </>
  );
};

const ChoiceParameterConfiguration = (props: {
  parameterName: string;
  formName: string;
  defaultSelection: string;
  options: Array<string>;
  control: Control<ExplainerParameters>;
}) => {
  const { t, i18n } = useTranslation();
  return (
    <Form.Group>
      <Form.Label>
        <h6>{props.parameterName}</h6>
      </Form.Label>
      <Form.Control
        as="select"
        name={props.formName}
        defaultValue={props.defaultSelection}
        ref={props.control.register({
          required: true,
        })}
      >
        {props.options.map((selectionOption: string) => (
          <option value={selectionOption} key={selectionOption}>
            {selectionOption}
          </option>
        ))}
      </Form.Control>
      {i18n.exists("explainer.parameter." + props.parameterName) &&
        t("explainer.parameter." + props.parameterName)}
    </Form.Group>
  );
};
