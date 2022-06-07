import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import { useTranslation } from "react-i18next";
import { ParameterDescription, XAIModel } from "../api";

import { ExplainerCard } from "../util";

import { ExplainerParameters } from "./ExplainerMenu";
import { useController, Control, useWatch } from "react-hook-form";
import { Classifier } from "../api";

import { InformationModal } from "../util";
import { Nav } from "react-bootstrap";
import { info } from "console";

/**
 * Renders the XAI-Model Selection
 */
export const XAIModelSelection = (props: {
  control: Control<ExplainerParameters>;
  initialClassifier: Classifier | null;
  initialGlobalLocal: "local" | "global" | null;
}) => {
  const { t } = useTranslation();

  const classifier = useWatch<ExplainerParameters["classifier"]>({
    control: props.control,
    name: "classifier",
    defaultValue: props.initialClassifier,
  });

  const global_local = useWatch<ExplainerParameters["global_local"]>({
    control: props.control,
    name: "global_local",
    defaultValue: props.initialGlobalLocal,
  });

  const { field } = useController({
    name: "xai_models",
    control: props.control,
    rules: {
      validate: (selection) => selection.length !== 0,
    },
  });

  const [cards_enabled, compatible_models] = React.useMemo(() => {
    if (classifier === null) {
      return [false, []];
    } else if (classifier !== null && global_local === null) {
      return [false, classifier.xai_models];
    } else {
      return [
        true,
        classifier.xai_models.filter(
          (model: XAIModel) =>
            (model.global && global_local === "global") ||
            (model.local && global_local === "local")
        ),
      ];
    }
  }, [classifier, global_local]);

  const uuidEqual = (searched_uuid: string) => {
    return (model: any) => {
      return model.uuid === searched_uuid;
    };
  };

  React.useEffect(() => {
    if (!cards_enabled && field.value.length > 0) {
      //Reset the xai_model selection
      field.onChange([]);
    } else if (compatible_models.length > 0 && cards_enabled) {
      //Display all compatible xai_models with a compatible scope
      if (field.value.length === 0 && compatible_models.length === 1) {
        field.onChange([compatible_models[0]]);
      } else {
        //Keep selection, if the selection is still compatible
        const new_models = field.value.filter(
          (model: XAIModel) =>
            compatible_models.findIndex(uuidEqual(model.uuid)) >= 0
        );

        if (new_models.length < field.value.length) {
          field.onChange(new_models);
        }
      }
    }
  }, [cards_enabled, field, compatible_models]);

  const handleClick = (xaiModel: XAIModel) => {

    let newSelection: Array<XAIModel> = field.value;

    //ADDED (check whether the information button in the InformationModal was pressed. If yes, the model selection itself shall not fire)
    //In case that the information button is "in" the ExplainerCard. Problem: If the ExplainerCard is clicked, the onSelect prop fires BEFORE
    //the onOpen prop of InformationModal fires. So the infoPressed variable gets set to "true" too late and the model selection fires
    //Thats why right now the Information button is not "in" the Card, but next to it, so there isnt a problem with a clicking order
    if(!infoPressed) {
      const idx = field.value.findIndex(uuidEqual(xaiModel.uuid));
      if (idx === -1) {
        newSelection = newSelection.concat([xaiModel]);
      } else {
        newSelection.splice(idx, 1);
      }
    }
    //ADDED

    return newSelection;
  };

  const [infoPressed, setInfoPressed] = useState<boolean>(false);

  return (
    <Row>
      {compatible_models.map((xaiModel: XAIModel) => (
        <>
        <ExplainerCard
          min_width="18rem"
          key={xaiModel.uuid}
          active={field.value.findIndex(uuidEqual(xaiModel.uuid)) !== -1}
          clickable={compatible_models.length > 1}
          enabled={cards_enabled}
          onSelect={() =>
            field.onChange(handleClick(xaiModel).map((model) => model))
          }
        >
          <ExplainerCard.Body>
            <ExplainerCard.Title className="text-center">
              {xaiModel.name}
              
            </ExplainerCard.Title>
            <ExplainerCard.Subtitle>
              {xaiModel.parameters.length > 0 &&
                t("explainer.xai_model.parameters")}
            </ExplainerCard.Subtitle>
            <ul>
              {xaiModel.parameters.map((description: ParameterDescription) => {
                return <li key={description.name}>{description.name}</li>;
              })}
            </ul>
          </ExplainerCard.Body>
          
        </ExplainerCard>
        <InformationModal
                title={xaiModel.name} 
                info={"Insert an information text here, for example stored in xaiModel.info."}
                onOpen={() => setInfoPressed(true)}
                onClose={() => setInfoPressed(false)}
              />
        </>
      ))}
    </Row>
  );
};
