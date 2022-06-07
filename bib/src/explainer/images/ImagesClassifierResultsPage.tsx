import React from "react";
import { api_manager, Instance } from "../../api";
import { useTranslation } from "react-i18next";
import Tabs from "../../util/CustomTabs";
import Tab from "react-bootstrap/Tab";
import Button from "react-bootstrap/Button";
import { ExplainerParameters } from "../ExplainerMenu";
import { LinkContainer } from "react-router-bootstrap";
import { Form } from "formik";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

interface ImageClassifierResultProps {}

export interface XAIModelResult {}

/**
 * This is the main entry point to the Image Classifier Results Page
 */
export const ImagesClassifierResultsPage = (props: {
  onSubmit: any;
  classification: ImageClassifierResultProps;
  parameters: ExplainerParameters;
  responseTime: number;
}) => {

  //const [explainParameters, setExplainParameters] = React.useState<any>({});

  const { t } = useTranslation();

  return (
    <>
      <div className="flex-grow-1 d-flex overflow-hidden">
        <div className="col-4 d-flex flex-column">
          <div className="overflow-auto scrollbar-gutter">
            <ClassificationGroundTruth/>
            <ClassificationResultTable/>
            <LinkContainer to="/explain">
              <Button size="lg">{t("explainer.results.modify_parameter")}</Button>
            </LinkContainer>
          </div>
        </div>
        <div className="col-8 d-flex flex-column">
          <ClassificationResultImage/>
          <EnterExplainerParameters onSubmit={props.onSubmit}/>
        </div>
      </div>
    </>
  );
};

const ClassificationGroundTruth = () => {
  return (
    <>
      <h2>Ground Truth</h2>
      <img 
        src="https://www.bundesregierung.de/resource/image/1675778/16x9/1023/575/e0d4fefc32ef79de04313213b03aa9bf/sG/2019-09-26-waldgipfel.jpg"
        width="200" 
        height="200"
      />
    </>
  );
}

const ClassificationResultTable = () => {
  return (
    <>
      <Col>
        <h2>Classification Result</h2>
        <img 
          src="https://www.bundesregierung.de/resource/image/1675778/16x9/1023/575/e0d4fefc32ef79de04313213b03aa9bf/sG/2019-09-26-waldgipfel.jpg"
          width="200" 
          height="200"
        />
      </Col>
    </>
  );
}

const ClassificationResultImage = () => {
  return (
    <>
      <Col>
        <h2>Image Result</h2>
        <img 
          src="https://www.bundesregierung.de/resource/image/1675778/16x9/1023/575/e0d4fefc32ef79de04313213b03aa9bf/sG/2019-09-26-waldgipfel.jpg"
          width="200" 
          height="200"
        />
      </Col>
    </>
  );
}

const EnterExplainerParameters = (props: any) => {
  
  //implement a form here to enter parameters for explanation

  return (
    <>
      <Col>
        <h2>Enter Explanation Parameters</h2>
        <img 
          src="https://www.bundesregierung.de/resource/image/1675778/16x9/1023/575/e0d4fefc32ef79de04313213b03aa9bf/sG/2019-09-26-waldgipfel.jpg"
          width="200" 
          height="200"
        />
        <Button variant="primary" onClick={props.onSubmit}>
              Explain
        </Button>
      </Col>
    </>
  );
}