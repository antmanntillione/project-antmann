import React from "react";

import { useTranslation } from "react-i18next";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

interface ElapsedTime {
  milliseconds: number;
  seconds: number;
  minutes: number;
}

/**
 * Renders the Timer on the Results Page while polling
 */
export const ResultsTimer = (props: { start: number }) => {
  const [elapsed, setElapsed] = React.useState<ElapsedTime>({
    milliseconds: 0,
    seconds: 0,
    minutes: 0,
  });

  const { t } = useTranslation();

  React.useEffect(() => {
    const interval = setInterval(() => {
      const elapsedMilliseconds = Date.now() - props.start;

      setElapsed({
        milliseconds: elapsedMilliseconds % 1000,
        seconds: Math.floor(elapsedMilliseconds / 1000) % 60,
        minutes: Math.floor(elapsedMilliseconds / (1000 * 60)),
      });
    }, 100);

    return () => {
      window.clearInterval(interval);
    };
  });

  return (
    <Container>
      <Row className="justify-content-center">
        <span
          style={{
            textAlign: "center",
            fontSize: "5rem",
            fontWeight: 100,
            lineHeight: "160px",
            margin: 0,
          }}
        >
          {elapsed.minutes > 0 ? elapsed.minutes.toString() + ":" : ""}
          {String(elapsed.seconds).padStart(2, "0") + "."}
          {Math.floor(elapsed.milliseconds / 100)}
        </span>
      </Row>
      <Row className="justify-content-center">
        <h2>
          <Spinner animation="border" role="status" />{" "}
          {t("explainer.results.processing")}
        </h2>
      </Row>
    </Container>
  );
};
