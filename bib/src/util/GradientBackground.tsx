import React from "react";
import Card from "react-bootstrap/Card";

export function GradientBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        backgroundImage: "linear-gradient(270deg, #43cea2 , #185a9d)",
      }}
    >
      <Card
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Card.Body>{children}</Card.Body>
      </Card>
    </div>
  );
}
