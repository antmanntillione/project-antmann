import { render, screen, waitFor } from "@testing-library/react";
import i18n from "../i18n/config";
import { I18nextProvider } from "react-i18next";
import { api_manager } from "../api";

import local_explaination from "./test_resources/local_explaination.json";
import global_explaination from "./test_resources/global_explaination.json";
import { ExplainerResultsPage } from "./TimeseriesExplainerResultsPage";
import { ExplainerParameters } from "./ExplainerMenu";
import { instance } from "./test_resources/local_explaination_instance.json";
import { BrowserRouter } from "react-router-dom";
import { AISVisualizer } from "./visualizers/AIS";
import { ForcePlot } from "./visualizers/ShapPlots";
import { ResultsTimer } from "./ResultsTimer";
import { act } from "react-dom/test-utils";

jest.mock("../api");
jest.mock("./visualizers/AIS");
jest.mock("./visualizers/ShapPlots");
//Leaflet and SHAP exspect to be rendered in a browser enviroment
const mock_api = api_manager as jest.Mocked<typeof api_manager>;
const mock_ais = AISVisualizer as jest.MockedFunction<typeof AISVisualizer>;
const mock_shap = ForcePlot as jest.MockedFunction<typeof ForcePlot>;

interface ResultsPageProps {
  explanation: ExplainerResultProps;
  parameters: ExplainerParameters;
  responseTime: number;
}

interface ExplainerResultProps {
  feature_names: Array<string>;
  instances: Array<{
    ground_truth: string;
    classification: { [key: string]: number };
  }>;
  models: Array<XAIModelResult>;
}

export interface XAIModelResult {
  name: string;
  diagram_types: Array<string>;
  result: number[][][] | number[][];
}

it("Test Local Explaination", async () => {
  mock_api.getInstance.mockResolvedValue(instance);
  mock_ais.mockImplementation(() => <>AISMock</>);

  mock_shap.mockImplementation(() => <>SHAPMock</>);

  render(
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <ExplainerResultsPage {...(local_explaination as ResultsPageProps)} />
      </BrowserRouter>
    </I18nextProvider>
  );

  //Check if Parameters get shown
  await screen.findByText("Ground truth: -1");
  await screen.findByText("LimeForTime, SHAP KernelExplainer");
  await screen.findByText("9.058s");
  await screen.findByText("ecg");
});

it("Test Global Explaination", async () => {
  render(
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <ExplainerResultsPage {...(global_explaination as ResultsPageProps)} />
      </BrowserRouter>
    </I18nextProvider>
  );

  //Check if Parameters get shown
  await screen.findByText("SHAP DeepExplainer, SHAP GradientExplainer");
  await screen.findByText("mmsi, lon, lat, timediff, speed, course");
  await screen.findByText("76.621s");
  await screen.findByText("resnet_ais");
});

it("Timer test", async () => {
  jest.useFakeTimers("modern");
  const start = Date.now();
  render(<ResultsTimer start={start} />);

  await screen.findByText("00.0");

  act(() => {
    jest.advanceTimersByTime(100);
  });
  await screen.findByText("00.1");

  act(() => {
    jest.advanceTimersByTime(900);
  });
  await screen.findByText("01.0");

  act(() => {
    jest.advanceTimersByTime(59000);
  });
  await screen.findByText("1:00.0");
});
