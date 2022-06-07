import React from "react";
import { ExplainerParameters } from "../ExplainerMenu";
import { ImagesClassifierResultsPage } from "./ImagesClassifierResultsPage";
import { ImagesExplainerResultsPage } from "./ImagesExplainerResultsPage";
import { ResultsTimer } from "../ResultsTimer";
import { JobExplanationResultImages, JobClassificationResultImages, api_manager } from "../../api";
import { useTranslation } from "react-i18next";

type JobState = "processing" | "success" | "fail";
type ResultStep = "classify" | "explain";

/**
 * This is the Managment Component for the Images Classifier and Explainer Results Page which does the polling and renders the results, 
 * once those are ready
 */
export const JobProcessorImages = (props: ExplainerParameters) => {
  const { t } = useTranslation();
  const startTimestamp = React.useMemo(() => Date.now(), []);

  const cancelToken = React.useMemo(() => api_manager.createCancelToken(), []);
  const [endTime, setEndTime] = React.useState(0);
  const [jobState, setJobState] = React.useState<JobState>("processing");
  const [resultStep, setResultStep] = React.useState<ResultStep>("classify");
  const [classifierResult, setClassifierResult] = React.useState<JobClassificationResultImages | undefined>(undefined);
  const [explainerResult, setExplainerResult] = React.useState<JobExplanationResultImages | undefined>(undefined);
  const [jobId, setJobId] = React.useState<number | undefined>(undefined);
  
  const [explainParameters, setExplainParameters] = React.useState<any | undefined>(undefined);

  React.useEffect(() => {
    if (props.global_local === "global") {
      //not implemented
    } else if (props.global_local === "local") {
      //not implemented

      //test workaround:
      const result = 1;
      setClassifierResult(result);
      setJobState("success");
    } else {
      throw new Error("not implemented");
    }
  }, [props]);


  const onSubmitClassifyImage = (values: any) => {
    setResultStep("explain");

    //test workaround:
    setExplainParameters(1);
    setExplainerResult(1);
  }


  return (
    <>
      {
        jobState === "processing" && 
        <ResultsTimer start={startTimestamp}/>
      }
      {
        jobState === "success" &&
        resultStep === "classify" &&
        classifierResult !== undefined &&
        props.dataset !== null &&
        props.classifier !== null &&
        <ImagesClassifierResultsPage
              onSubmit={onSubmitClassifyImage}
              classification={classifierResult}
              parameters={props}
              responseTime={endTime - startTimestamp}
        />
      }
      {
        jobState === "success" &&
        resultStep === "explain" &&
        explainerResult !== undefined &&
        explainParameters !== undefined &&
        <ImagesExplainerResultsPage
            explanation={explainerResult}
            parameters={explainParameters}
        />
      }
      {
        jobState === "success" &&
        (
          resultStep === "classify" && classifierResult === undefined ||
          resultStep === "explain" && explainerResult === undefined
        ) &&
        <div style={{ textAlign: "center" }}>
          <h1>{t("explainer.results.error")}</h1>
          <p>{t("explainer.results.classification_failed")}</p>
        </div>
      }
    </>
  );
};
