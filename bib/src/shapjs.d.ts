declare module "shapjs" {
  import { Component } from "react";

  export type CmapName =
    | "RdBu"
    | "GnPR"
    | "CyPU"
    | "PkYg"
    | "DrDb"
    | "LpLb"
    | "YlDp"
    | "OrId";

  export interface Feature {
    effect: number;
    value?: number;
  }

  export interface SimpleListVisualizerProps {
    plot_cmap?: CmapName | [string, string];
    features: Array<Feature>;
    featureNames: Array<string>;
  }

  export class SimpleListVisualizer extends Component<SimpleListVisualizerProps> {}

  export interface AdditiveForceVisualizerProps {
    outNames: Array<string>;
    baseValue: number;
    link: "identity" | "logit";
    featureNames: Array<string>;
    features: Array<Feature>;
    plot_cmap?: CmapName | Array<string>;
    width?: number;
    height?: number;
    transform?: string;
    hideBars?: boolean;
    labelMargin?: number;
    hideBaseValueLabel?: boolean;
  }

  export class AdditiveForceVisualizer extends Component<AdditiveForceVisualizerProps> {}
}
