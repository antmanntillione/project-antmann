import React from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import "./ExplainerCard.css";

interface CardProps {
  active: boolean;
  enabled: boolean;
  onSelect(): void;
  min_width: string;
  clickable: boolean;
}

export const ExplainerCard = (props: React.PropsWithChildren<CardProps>) => {
  /*
  {props.enabled && (
            <div onClick={props.onSelect} className="btn stretched-link" />
          )}
  */

  let className = "h-100";
  if (props.enabled) {
    if (props.active) {
      if (props.clickable) {
        className += " cardActiveClickable";
      }
      className += " cardActive";
    } else {
      if (props.clickable) {
        className += " cardInactiveClickable";
      }
      className += " cardInactive";
    }
  }

  return (
    <Col md="auto" className="mb-4">
      <Card
        className={className}
        onClick={() => props.enabled && props.onSelect()}
        style={{
          minWidth: props.min_width,
        }}
      >
        <Card.Body>{props.children}</Card.Body>
      </Card>
    </Col>
  );
};

ExplainerCard.Title = Card.Title;
ExplainerCard.Subtitle = Card.Subtitle;
ExplainerCard.Text = Card.Text;
