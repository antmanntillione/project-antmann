import React from "react";
import { useTranslation } from "react-i18next";
import Row from "react-bootstrap/Row";
import { ExplainerCard } from "../util";

import { ExplainerParameters } from "./ExplainerMenu";
import { useController, Control, useWatch } from "react-hook-form";

/**
 * This renders the Global-Local Selection
 */
export const GlobalLocalSelection = (props: {
  control: Control<ExplainerParameters>;
  initialClassifier: ExplainerParameters["classifier"];
}) => {
  const { t } = useTranslation();

  const classifier = useWatch<ExplainerParameters["classifier"]>({
    control: props.control,
    name: "classifier",
    defaultValue: props.initialClassifier,
  });

  const { field } = useController({
    name: "global_local",
    control: props.control,
    rules: {
      required: true,
    },
  });

  const [global_possible, local_possible] = React.useMemo(() => {
    let global_compatible = false;
    let local_compatible = false;
    if (classifier !== null) {
      for (const model of classifier.xai_models) {
        global_compatible = global_compatible || model.global;
        local_compatible = local_compatible || model.local;
      }
      return [global_compatible, local_compatible];
    } else {
      return [false, false];
    }
  }, [classifier]);

  React.useEffect(() => {
    if (local_possible && !global_possible && field.value !== "local") {
      field.onChange("local");
    } else if (global_possible && !local_possible && field.value !== "global") {
      field.onChange("global");
    } else if (!global_possible && !local_possible && field.value !== null) {
      field.onChange(null);
    }
  });

  return (
    <Row>
      <ExplainerCard
        clickable={field.value !== "local"}
        min_width="20rem"
        active={field.value === "local"}
        enabled={local_possible}
        onSelect={() => field.onChange("local")}
      >
        <ExplainerCard.Body>
          <ExplainerCard.Title className="text-center">
            {t("explainer.global_local.local_name")}
          </ExplainerCard.Title>
          <ExplainerCard.Text>
            {t("explainer.global_local.local_description")}
          </ExplainerCard.Text>
        </ExplainerCard.Body>
      </ExplainerCard>
      <ExplainerCard
        min_width="20rem"
        clickable={field.value !== "global"}
        active={field.value === "global"}
        enabled={global_possible}
        onSelect={() => field.onChange("global")}
      >
        <ExplainerCard.Body>
          <ExplainerCard.Title className="text-center">
            {t("explainer.global_local.global_name")}
          </ExplainerCard.Title>
          <ExplainerCard.Text>
            {t("explainer.global_local.global_description")}
          </ExplainerCard.Text>
        </ExplainerCard.Body>
      </ExplainerCard>
    </Row>
  );
};
