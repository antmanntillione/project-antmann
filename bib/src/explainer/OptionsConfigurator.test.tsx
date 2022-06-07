import {
  render,
  fireEvent,
  waitFor,
  screen,
  findByText,
  queryByText,
} from "@testing-library/react";
import i18n from "../i18n/config";
import { I18nextProvider } from "react-i18next";
import { OptionsConfigurator } from "./OptionsConfigurator";
import {
  api_manager,
  DatasetWithClassifier,
  Classifier,
  XAIModel,
} from "../api";
import { classifiers } from "./test_resources/classifiers.json";
import { instances } from "./test_resources/instances.json";
import { instance } from "./test_resources/instance.json";
import { datasets } from "./test_resources/datasets.json";
import { AISVisualizer } from "./visualizers/AIS";

jest.mock("../api");
jest.mock("./visualizers/AIS");
const mock_api = api_manager as jest.Mocked<typeof api_manager>;
const mock_ais = AISVisualizer as jest.MockedFunction<typeof AISVisualizer>;

it("Explainer Basic Consitency", async () => {
  mock_api.getClassifiers.mockResolvedValue(classifiers as Array<Classifier>);
  mock_api.getDatasets.mockResolvedValue(
    datasets as Array<DatasetWithClassifier>
  );
  const submit_callback = jest.fn();
  render(
    <I18nextProvider i18n={i18n}>
      <OptionsConfigurator onSubmit={submit_callback} initialValues={null} />
    </I18nextProvider>
  );
  await waitFor(() =>
    expect(api_manager.getClassifiers).toHaveBeenCalledTimes(1)
  );

  const knn = (await (await screen.findByText("knn_ecg")).parentElement)!;
  const resnet = (await (await screen.findByText("resnet_ais")).parentElement)!;

  //Check if cards contain correct fields
  await findByText(knn, "SciKit");
  await findByText(knn, "LimeForTime");
  await findByText(knn, "SHAP KernelExplainer");

  await findByText(resnet, "Tensorflow");
  await findByText(resnet, "AIS4");
  await findByText(resnet, "LimeForTime");
  await findByText(resnet, "SHAP DeepExplainer");
  await findByText(resnet, "SHAP GradientExplainer");
  await findByText(resnet, "Path Integrated Gradient");

  //Check if dataset preview is rendered correctly
  const dataset_selection = await (await screen.findByText("Dataset selection"))
    .parentElement!;
  await findByText(dataset_selection, "AIS4");

  const local = await (await screen.findByText("Local")).parentElement
    ?.parentElement!;
  const global = await (await screen.findByText("Global")).parentElement
    ?.parentElement!;
  expect(local).toHaveClass("card");
  expect(global).toHaveClass("card");
  fireEvent.click(knn);
  await expect(local).toHaveClass("cardActive");
  await expect(global).toHaveClass("card");

  //AIS shouldnt be compatible and hidden
  const ais_dataset = queryByText(dataset_selection, "AIS4");
  expect(ais_dataset).toBeNull();

  //Change Classifier Selection to AIS
  fireEvent.click(resnet);
  await expect(local).toHaveClass("cardActive");
  await expect(global).toHaveClass("cardInactiveClickable");

  const ais4 = await findByText(dataset_selection, "AIS4");

  mock_api.getInstances.mockResolvedValue(instances);
  mock_api.getInstance.mockResolvedValue(instance);

  //We cannot render the leaflet-map so we have to mock the whole visualizer
  mock_ais.mockImplementation(({ data }) => <>{data[0][1]}</>);

  fireEvent.click(ais4);

  //The initial value gets set to zero
  // => The instances get fetched
  // => The instances got loaded
  // => The selected value gets rendered and triggers a rerender
  //This is a limitation from react-hook-forms we need to work arround
  await waitFor(() => expect(mock_ais).toHaveBeenCalledTimes(2));
  await expect(mock_api.getInstances).toHaveBeenCalledTimes(1);
  await expect(mock_api.getInstance).toHaveBeenCalledTimes(1);

  //Check if the card would have been rendered
  await screen.findByText(instance[0][1]);

  //Select XAI-Model
  const xai_model_selection = await (
    await screen.findByText("XAI Model selection")
  ).parentElement!;
  const lime = await findByText(xai_model_selection, "LimeForTime");
  fireEvent.click(lime);

  const parameter_configuration = await (
    await screen.findByText("Parameter selection")
  ).parentElement!;
  await findByText(parameter_configuration, "LimeForTime");

  //Check if Parameters get rendered
  await findByText(parameter_configuration, "replacement_method");
  await findByText(parameter_configuration, "num_samples: 5000");

  const submitButton = await screen.findByText("Run explainer");

  fireEvent.click(submitButton);
  await waitFor(() => expect(submit_callback).toHaveBeenCalledTimes(1));
});

it("Explainer Load Values", async () => {
  mock_api.getClassifiers.mockResolvedValue(classifiers as Array<Classifier>);
  mock_api.getDatasets.mockResolvedValue(
    datasets as Array<DatasetWithClassifier>
  );

  mock_api.getInstances.mockResolvedValue(instances);
  mock_api.getInstance.mockResolvedValue(instance);

  mock_ais.mockImplementation(({ data }) => <>{data[0][1]}</>);

  const submit_callback = jest.fn();
  render(
    <I18nextProvider i18n={i18n}>
      <OptionsConfigurator
        onSubmit={submit_callback}
        initialValues={{
          classifier: classifiers[1] as Classifier,
          xai_models: [classifiers[1].xai_models[1] as XAIModel],
          global_local: "local",
          dataset: datasets[3],
          instance_amount: 0,
          instance: 0,
          parameter: {
            "2397026b-35a0-541d-978b-476efff56166": {
              background_dataset: 2000,
            },
          },
        }}
      />
    </I18nextProvider>
  );

  const classifier = await (await screen.findByText("resnet_ais")).parentElement
    ?.parentElement!;
  expect(classifier).toHaveClass("cardActive");

  const local_button = await (await screen.findByText("Local")).parentElement
    ?.parentElement!;
  expect(local_button).toHaveClass("cardActive");

  await screen.findByText(instance[0][1]);
  await screen.findByText("background_dataset: 2000");
});
