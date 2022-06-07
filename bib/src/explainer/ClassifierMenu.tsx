import React from "react";
import { api_manager } from "../api";
import { Classifier, Dataset, XAIModel } from "../api/api_types";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useTranslation } from "react-i18next";
import { ExplainerCard } from "../util";
import { ExplainerParameters } from "./ExplainerMenu";
import { useController, Control } from "react-hook-form";
import { computeHeadingLevel } from "@testing-library/dom";

/**
 * This renders the classifier selection section
 */
export const ClassifierSelection = (props: {
  control: Control<ExplainerParameters>;
}) => {
  const { t } = useTranslation();
  const [classifiers, setClassifiers] = React.useState<Array<Classifier>>([]);

  const { field } = useController({
    name: "classifier",
    control: props.control,
    rules: {
      required: true,
    },
  });

  React.useEffect(() => {
    api_manager
      .getClassifiers()
      .then((response) => {
        setClassifiers(response);
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  // Get the unique classifier types that it is compatible with from the available classifiers. Initialized with "all" to display all the classifiers in the front page
  const uniqueClassifierTypes = React.useMemo(() => {
    const uniqueClassifierTypesOptions: Array<string> = ["all"];
    classifiers.forEach((classifier: Classifier) => {
      if (
        !uniqueClassifierTypesOptions.includes(
          classifier.compatible_dataset_type
        )
      ) {
        uniqueClassifierTypesOptions.push(classifier.compatible_dataset_type);
      }
    });

    return uniqueClassifierTypesOptions;
  }, [classifiers]);

  // To handle classifierOptions dropdown changes
  const [
    classifierfCompatibleType,
    setClassifierfCompatibleType,
  ] = React.useState<string>(() => {
    if (!field.value?.compatible_dataset_type) {
      return "all";
    } else {
      return field.value?.compatible_dataset_type;
    }
  });

  return (
    <Form.Group>
      <Row style={{ padding: "0px 0px 10px 0px" }}>
        <Form.Label column sm={"auto"}>
          {t("explainer.classifier.compatible_dataset_type.available_clfs") +
            ":"}
        </Form.Label>
        <Form.Control
          style={{ maxWidth: "25rem" }}
          {...field}
          as="select"
          id="classifierOptions"
          value={classifierfCompatibleType}
          onChange={(e) => setClassifierfCompatibleType(e.currentTarget.value)}
        >
          {uniqueClassifierTypes.map((option) => {
            return (
              <option key={option} value={option}>
                {t(
                  "explainer.classifier.compatible_dataset_type.options." +
                    option
                )}
              </option>
            );
          })}
        </Form.Control>
      </Row>
      <Row>
        {classifiers.map((classifier: Classifier) => {
          if (
            classifierfCompatibleType === classifier.compatible_dataset_type
          ) {
            return (
              <ExplainerCard
                clickable={field.value !== classifier}
                enabled={true}
                min_width="18rem"
                key={classifier.uuid}
                active={field.value?.uuid === classifier.uuid}
                onSelect={() => field.onChange(classifier)}
              >
                <ExplainerCard.Body>
                  <ExplainerCard.Title className="text-center">
                    {classifier.name}
                  </ExplainerCard.Title>
                  <ExplainerCard.Subtitle>
                    {t("explainer.classifier.type")}
                  </ExplainerCard.Subtitle>
                  <ul>
                    <li>{classifier.framework}</li>
                  </ul>
                  <ExplainerCard.Subtitle>
                    {t(
                      "explainer.classifier.compatible_dataset_type.sub_title"
                    )}
                  </ExplainerCard.Subtitle>
                  <ul>
                    <li>
                      {t(
                        "formFields.datasetType.options." +
                          classifier.compatible_dataset_type
                      )}
                    </li>
                  </ul>
                  <ExplainerCard.Subtitle>
                    {t("explainer.classifier.compatible_datasets")}:
                  </ExplainerCard.Subtitle>
                  <ul>
                    {classifier.datasets.map((dataset: Dataset) => {
                      return <li key={dataset.name}>{dataset.name}</li>;
                    })}
                  </ul>
                  <ExplainerCard.Subtitle>
                    {t("explainer.classifier.compatible_xai_models")}:
                  </ExplainerCard.Subtitle>
                  <ul>
                    {classifier.xai_models.map((xaiModel: XAIModel) => {
                      return <li key={xaiModel.name}>{xaiModel.name}</li>;
                    })}
                  </ul>
                </ExplainerCard.Body>
              </ExplainerCard>
            );
          } else {
            if (classifierfCompatibleType === "all") {
              return (
                <ExplainerCard
                  clickable={field.value !== classifier}
                  enabled={true}
                  min_width="18rem"
                  key={classifier.uuid}
                  active={field.value?.uuid === classifier.uuid}
                  onSelect={() => field.onChange(classifier)}
                >
                  <ExplainerCard.Body>
                    <ExplainerCard.Title className="text-center">
                      {classifier.name}
                    </ExplainerCard.Title>
                    <ExplainerCard.Subtitle>
                      {t("explainer.classifier.type")}
                    </ExplainerCard.Subtitle>
                    <ul>
                      <li>{classifier.framework}</li>
                    </ul>
                    <ExplainerCard.Subtitle>
                      {t(
                        "explainer.classifier.compatible_dataset_type.sub_title"
                      )}
                    </ExplainerCard.Subtitle>
                    <ul>
                      <li>
                        {t(
                          "formFields.datasetType.options." +
                            classifier.compatible_dataset_type
                        )}
                      </li>
                    </ul>
                    <ExplainerCard.Subtitle>
                      {t("explainer.classifier.compatible_datasets")}:
                    </ExplainerCard.Subtitle>
                    <ul>
                      {classifier.datasets.map((dataset: Dataset) => {
                        return <li key={dataset.name}>{dataset.name}</li>;
                      })}
                    </ul>
                    <ExplainerCard.Subtitle>
                      {t("explainer.classifier.compatible_xai_models")}:
                    </ExplainerCard.Subtitle>
                    <ul>
                      {classifier.xai_models.map((xaiModel: XAIModel) => {
                        return <li key={xaiModel.name}>{xaiModel.name}</li>;
                      })}
                    </ul>
                  </ExplainerCard.Body>
                </ExplainerCard>
              );
            }
          }
        })}
      </Row>
    </Form.Group>
  );
};

/*

{uniqueClassifierTypes.map((type: string) => {
  return (  
    <>        
      <Form.Check
        inline
        name="classifierOptions"
        type="radio"
        id={type}
        label={t("explainer.classifier.compatible_dataset_type.options." + type)}
        defaultChecked={classifierfCompatibleType === type}
        onChange={e => setClassifierfCompatibleType(e.currentTarget.id)}                         
      />
    </>            
  )})
}

*/
