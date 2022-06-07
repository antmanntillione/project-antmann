import React from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { useTranslation } from "react-i18next";
import { EditDialogue, useEditDialogue } from "../util";

import { api_manager, Classifier } from "../api";
import { Formik, useFormikContext, FieldArray } from "formik";

import { GearIcon } from "@primer/octicons-react";

interface ChangeCompatibilityProps {
  onChangeCompatibility(): void;
  name: string;
  compatible_classifiers: Array<[string, string]>;
  classifiers: Array<Classifier>;
  id: number;
  type: string;
}

/**
 * This component is a subcomponent of the datasetMenu component which provides a dialogue
 *  to add or remove compatible classifers as well as a corresponding button to open the dialogue.
 * @param props the name and the id of the dataset, a call-back function to the parent component
 * which is fired upon renaming the dataset and a list of all classifiers as well as those
 *  that the dataset is currently compatible with
 */
export const ChangeCompability = (props: ChangeCompatibilityProps) => {
  const { t } = useTranslation();
  return (
    <EditDialogue
      title={t("datasets.compatibility_dialogue.title") + " " + props.name}
      body={t("datasets.compatibility_dialogue.body")}
    >
      <ChangeCompability.OpenModalButton name={props.name} />
      <EditDialogue.Modal>
        <ChangeCompability.Formik {...props} />
      </EditDialogue.Modal>
    </EditDialogue>
  );
};

//The react plugin cant handle sub-components
/* eslint-disable react-hooks/rules-of-hooks, react/display-name */

ChangeCompability.OpenModalButton = (props: { name: string }) => {
  const { handleShow } = useEditDialogue();
  const { t } = useTranslation();
  return (
    <Button
      data-testid={"changecomp" + props.name}
      variant="primary"
      title={t("datasets.compatibility_dialogue.tooltip_change_compatibility")}
      size="sm"
      onClick={handleShow}
    >
      <GearIcon />
    </Button>
  );
};

interface ChangeCompabilityValues {
  classifiers: Array<string>;
}

let selectedDatasetType: string; // To catch the type of the selected dataset when changeCompatibilty modal window opens
ChangeCompability.Formik = (props: ChangeCompatibilityProps) => {
  const { setErrorMessage, handleClose } = useEditDialogue();
  selectedDatasetType = props.type;

  const handleFormSubmit = (values: ChangeCompabilityValues) => {
    api_manager
      .changeCompability(props.id, values.classifiers)
      .then((response) => {
        handleClose();
        props.onChangeCompatibility();
      })
      .catch((error) => {
        if (error.message) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Internal Error");
        }
      });
  };

  const classifiers = React.useMemo(() => {
    const classifierOptions: Array<[string, string, string]> = [];
    let classifierUUIDSet = new Set();
    props.classifiers.forEach((classifier: Classifier) => {
      if (!classifierUUIDSet.has(classifier.uuid)) {
        classifierUUIDSet.add(classifier.uuid);
        classifierOptions.push([
          classifier.name,
          classifier.uuid,
          classifier.compatible_dataset_type,
        ]);
      }
    });

    // Commenting out because it seems like below part of the code has no major functionality
    // props.compatible_classifiers.forEach((classifier) => {
    //   if (!classifierUUIDSet.has(classifier[1])) {
    //     classifierUUIDSet.add(classifier[1]);
    //     classifierOptions.push(classifier);
    //   }
    // });

    return classifierOptions;
  }, [props.classifiers, props.compatible_classifiers]);

  const initialValues: ChangeCompabilityValues = {
    classifiers: props.compatible_classifiers.map((x) => x[1]),
  };

  return (
    <Formik onSubmit={handleFormSubmit} initialValues={initialValues}>
      <ChangeCompability.Form all_classifiers={classifiers} />
    </Formik>
  );
};

ChangeCompability.Form = (props: {
  all_classifiers: Array<[string, string, string]>;
}) => {
  const { handleSubmit } = useFormikContext<ChangeCompabilityValues>();

  return (
    <Form onSubmit={handleSubmit}>
      <EditDialogue.Body>
        <ChangeCompability.ClassifierSelection
          all_classifiers={props.all_classifiers}
        />
      </EditDialogue.Body>
      <EditDialogue.Footer>
        <ChangeCompability.Buttons />
      </EditDialogue.Footer>
    </Form>
  );
};

ChangeCompability.ClassifierSelection = (props: {
  all_classifiers: Array<[string, string, string]>;
}) => {
  const { values } = useFormikContext<ChangeCompabilityValues>();

  return (
    <Form.Group>
      <FieldArray name="classifiers">
        {(arrayHelper) => {
          return (
            <>
              {props.all_classifiers.map((classifier) => {
                if (selectedDatasetType === classifier[2]) {
                  return (
                    <>
                      <Form.Check
                        data-testid={"classifier" + classifier[0]}
                        type="checkbox"
                        key={classifier[1]}
                        label={classifier[0]}
                        defaultChecked={values.classifiers.includes(
                          classifier[1]
                        )}
                        onChange={(event) => {
                          if (event.currentTarget.checked) {
                            arrayHelper.push(classifier[1]);
                          } else {
                            const idx = values.classifiers.indexOf(
                              classifier[1]
                            );
                            arrayHelper.remove(idx);
                          }
                        }}
                      />
                    </>
                  );
                } else {
                  return (
                    <>
                      <Form.Check
                        disabled
                        data-testid={"classifier" + classifier[0]}
                        type="checkbox"
                        key={classifier[1]}
                        label={classifier[0]}
                        defaultChecked={values.classifiers.includes(
                          classifier[1]
                        )}
                      />
                    </>
                  );
                }
              })}
            </>
          );
        }}
      </FieldArray>
    </Form.Group>
  );
};

ChangeCompability.Buttons = () => {
  const { dirty } = useFormikContext<ChangeCompabilityValues>();

  const { t } = useTranslation();

  const { handleClose } = useEditDialogue();
  return (
    <>
      <Button variant="secondary" onClick={handleClose}>
        {t("datasets.compatibility_dialogue.close")}
      </Button>
      <Button
        data-testid="submitComp"
        variant="primary"
        type="submit"
        disabled={!dirty}
      >
        {t("datasets.compatibility_dialogue.submit")}
      </Button>
    </>
  );
};

/* eslint-enable */
