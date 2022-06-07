import React from "react";
import { ExplainerParameters } from "../ExplainerMenu";
import { TimeseriesExplainerResultsPage } from "./TimeseriesExplainerResultsPage";
import { ResultsTimer } from "../ResultsTimer";
import { JobExplanationResult, api_manager } from "../../api";
import { useTranslation } from "react-i18next";

type JobState = "processing" | "success" | "fail";

/**
 * This is the Managment Component for the Results Page which does the polling and renders the results, once those are ready
 */
export const JobProcessorTimeseries = (props: ExplainerParameters) => {
  const { t } = useTranslation();
  const startTimestamp = React.useMemo(() => Date.now(), []);

  const cancelToken = React.useMemo(() => api_manager.createCancelToken(), []);
  const [endTime, setEndTime] = React.useState(0);
  const [jobState, setJobState] = React.useState<JobState>("processing");
  const [explainerResult, setExplainerResult] = React.useState<
    JobExplanationResult | undefined
  >(undefined);
  const [jobId, setJobId] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    if (props.global_local === "global") {
      api_manager
        .explain_global(
          props.dataset!.id,
          props.instance_amount,
          props.classifier!.uuid,
          props.xai_models.map((x) => x.uuid),
          props.parameter
        )
        .then((response) => {
          setJobId(response);
        })
        .catch((error) => setJobState("fail"));
    } else if (props.global_local === "local") {
      api_manager
        .explain_local(
          props.dataset!.id,
          props.instance,
          props.classifier!.uuid,
          props.xai_models.map((x) => x.uuid),
          props.parameter
        )
        .then((response) => {
          setJobId(response);
        })
        .catch(() => setJobState("fail"));
    } else {
      throw new Error("not implemented");
    }
  }, [props]);

  const exponentialPoll = React.useCallback(
    (retry_count: number, job: number) => {
      api_manager
        .getJob(job, cancelToken.token)
        .then((response) => {
          setEndTime(Date.now());
          setExplainerResult(response);
          setJobState("success");
        })
        .catch((error) => {
          if (error.polling_error) {
            new Promise((resolve) =>
              setTimeout(resolve, 25 * Math.pow(retry_count, 1.5))
            ).then(() => exponentialPoll(retry_count + 1, job));
          } else if (!api_manager.isCancel(error)) {
            setJobState("fail");
            setEndTime(Date.now());
          }
        });
    },
    [cancelToken.token]
  );

  React.useEffect(() => {
    if (jobId === undefined) {
      return;
    }
    exponentialPoll(0, jobId);
    return () => {
      cancelToken.cancel("Menu left");
    };
  }, [jobId, exponentialPoll, cancelToken]);
  
  if (jobState === "processing") {
    return <ResultsTimer start={startTimestamp} />;
  } else if (
    jobState === "success" &&
    explainerResult !== undefined &&
    props.dataset !== null &&
    props.classifier !== null
  ) {
    return (
      <>
        <TimeseriesExplainerResultsPage
          explanation={explainerResult}
          parameters={props}
          responseTime={endTime - startTimestamp}
        />
      </>
    );
  } else {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>{t("explainer.results.error")}</h1>
        <p>{t("explainer.results.classification_failed")}</p>
      </div>
    );
  }
};
