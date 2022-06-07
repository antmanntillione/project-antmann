import React from "react";
import { useTranslation } from "react-i18next";
import { api_manager, Instance, Dataset } from "../api";
import Form from "react-bootstrap/Form";

import { ExplainerParameters } from "./ExplainerMenu";
import { Control, useWatch } from "react-hook-form";
import { InstancePlotFactory } from "./visualizers/InstancePlotFactory";
import { ImageSelection } from "./visualizers/ImageSelection";

/**
 * This renders the Instance Picker / Instance Number Selection depending on the global_local field
 */
export const InstanceSelection = (props: {
  control: Control<ExplainerParameters>;
  initialGlobalLocal: ExplainerParameters["global_local"];
  initialDataset: ExplainerParameters["dataset"];
  initialInstance: ExplainerParameters["instance"];
  initialInstanceAmount: ExplainerParameters["instance_amount"];
}) => {
  const global_local = useWatch<ExplainerParameters["global_local"]>({
    control: props.control,
    name: "global_local",
    defaultValue: props.initialGlobalLocal,
  });

  const dataset = useWatch<ExplainerParameters["dataset"]>({
    control: props.control,
    name: "dataset",
    defaultValue: props.initialDataset,
  });

  return (
    <>
      <InstanceNumberSelection
        hidden={
          dataset === null || 
          global_local !== "global" ||
          (dataset.dataset_type != "timeseries" && dataset.dataset_type != "timeseries_georeferenced")
        }
        dataset_instance_count={
          dataset ? dataset.additional_params.num_instances : 0
        }
        control={props.control}
        initialInstanceAmount={props.initialInstanceAmount}
      />
      <InstancePicker
        hidden={
          dataset === null || 
          global_local !== "local" ||
          (dataset.dataset_type != "timeseries" && dataset.dataset_type != "timeseries_georeferenced")
        }
        control={props.control}
        initialDataset={props.initialDataset}
        initialGlobalLocal={props.initialGlobalLocal}
        initialInstance={props.initialInstance}
      />
      <ImageSelection 
        hidden={
          dataset === null ||
          dataset.dataset_type != "image"
        }
        control={props.control}
        initialDataset={props.initialDataset}
      />
    </>
  );
};

const InstancePicker = (props: {
  control: Control<ExplainerParameters>;
  initialDataset: ExplainerParameters["dataset"];
  initialGlobalLocal: ExplainerParameters["global_local"];
  initialInstance: ExplainerParameters["instance"];
  hidden: boolean;
}) => {
  const dataset = useWatch<ExplainerParameters["dataset"]>({
    control: props.control,
    name: "dataset",
    defaultValue: props.initialDataset,
  });

  const [instances, setInstances] = React.useState<Array<string>>([]);
  const { t } = useTranslation();

  React.useEffect(() => {
    if (dataset !== null && !props.hidden) {
      api_manager
        .getInstances(dataset.id)
        .then((response) => {
          const new_instances: Array<string> = response;
          setInstances(new_instances);
        })
        .catch((error) => {
          alert(error);
        });
    }
  }, [dataset]);
  
    return (
      <>
        <Form.Group
          style={props.hidden ? { display: "none" } : { maxWidth: "45rem" }}
        >
        <Form.Label>{t("explainer.instance.instance_selection")}</Form.Label>
        {instances.length > 0 && (
          <Form.Control
            as="select"
            name="instance"
            ref={props.control.register({
              valueAsNumber: true,
              required: true,
            })}
          >
            {instances.map((instance: string, index: number) => (
              <option value={index} key={instance}>
                {instance}
              </option>
            ))}
          </Form.Control>
        )}
        </Form.Group>
        {!props.hidden && dataset !== null && (
          <InstancePickerPreview
            control={props.control}
            dataset={dataset}
            key={dataset.id}
            initialInstance={props.initialInstance}
          />
        )}
      </>
    );
};

const InstancePickerPreview = (props: {
  control: Control<ExplainerParameters>;
  dataset: Dataset;
  initialInstance: ExplainerParameters["instance"];
}) => {
  const instance = useWatch<ExplainerParameters["instance"]>({
    control: props.control,
    name: "instance",
    defaultValue: props.initialInstance,
  });

  const [instance_data, set_instance_data] = React.useState<Instance>([]);

  React.useEffect(() => {
    api_manager
      .getInstance(props.dataset.id, instance)
      .then((response) => {
        set_instance_data(response);
      })
      .catch((error) => {
        alert(error);
      });
  }, [instance, props.dataset.id]);

  if (instance_data.length === 0) {
    return <></>;
  } else {
      return (
        <InstancePlotFactory
          featureNames={props.dataset.additional_params?.feature_names}
          instance={instance_data}
          datasetType={props.dataset.dataset_type}
        />
      );
    }
};

const InstanceNumberSelection = (props: {
  control: Control<ExplainerParameters>;
  dataset_instance_count: number;
  hidden: boolean;
  initialInstanceAmount: ExplainerParameters["instance_amount"];
}) => {
  const { t } = useTranslation();

  const instance_amount = useWatch<ExplainerParameters["instance_amount"]>({
    control: props.control,
    name: "instance_amount",
    defaultValue: props.initialInstanceAmount,
  });

  return (
    <Form.Group
      style={props.hidden ? { display: "none" } : { maxWidth: "45rem" }}
    >
      <Form.Label>
        {t("explainer.instance.instance_count")}: {instance_amount}
      </Form.Label>
      <Form.Control
        type="range"
        min="2"
        name="instance_amount"
        defaultValue={
          props.dataset_instance_count > 10 ? 10 : props.dataset_instance_count
        }
        ref={props.control.register({
          valueAsNumber: true,
          required: true,
        })}
        max={
          props.dataset_instance_count > 100
            ? 100
            : props.dataset_instance_count
        }
      />
    </Form.Group>
  );
};
