import {
  render,
  fireEvent,
  waitFor,
  screen,
  findByText,
  queryByText,
} from "@testing-library/react";
import i18n from "../../i18n/config";
import { I18nextProvider } from "react-i18next";
import { api_manager } from "../../api";
import { UserRating } from "./UserRating";

jest.mock("../api");
const mock_api = api_manager as jest.Mocked<typeof api_manager>;

it("User rating test without comment", async () => {
  mock_api.addRating.mockResolvedValue(null);
  render(
    <I18nextProvider i18n={i18n}>
      <UserRating
        xaiModelName={"SHAP DeepExplainer"}
        datasetID={6}
        classifierID={"3082937f-64ff-5dc5-847c-714f8febaee9"}
      />
    </I18nextProvider>
  );

  screen.getByRole("radiogroup", { name: /Rating in Stars/i });

  const submitButton = screen.getByRole("button", { name: "Submit" });
  await waitFor(() => expect(submitButton).toBeDisabled());

  const two_stars = screen.getByRole("radio", { name: /2 Stars/i });
  fireEvent.click(two_stars);

  await waitFor(() => expect(submitButton).toBeEnabled());
  fireEvent.click(submitButton);

  await waitFor(() =>
    expect(mock_api.addRating).toHaveBeenCalledWith(
      2,
      "",
      6,
      "3082937f-64ff-5dc5-847c-714f8febaee9",
      "SHAP DeepExplainer"
    )
  );
  await waitFor(() => screen.getByText("Your comment has been added"));
});

it("User rating test with comment", async () => {
  mock_api.addRating.mockResolvedValue(null);
  render(
    <I18nextProvider i18n={i18n}>
      <UserRating
        xaiModelName={"SHAP DeepExplainer"}
        datasetID={6}
        classifierID={"3082937f-64ff-5dc5-847c-714f8febaee9"}
      />
    </I18nextProvider>
  );

  screen.getByRole("radiogroup", { name: /Rating in Stars/i });

  const submitButton = screen.getByRole("button", { name: "Submit" });
  await waitFor(() => expect(submitButton).toBeDisabled());

  const commentField = screen.getByRole("textbox");
  fireEvent.change(commentField, { target: { value: "Gute diese" } });

  const three_stars = screen.getByRole("radio", { name: /3 Stars/i });
  fireEvent.click(three_stars);

  await waitFor(() => expect(submitButton).toBeEnabled());
  fireEvent.click(submitButton);

  await waitFor(() =>
    expect(mock_api.addRating).toHaveBeenCalledWith(
      3,
      "Gute diese",
      6,
      "3082937f-64ff-5dc5-847c-714f8febaee9",
      "SHAP DeepExplainer"
    )
  );
  await waitFor(() => screen.getByText("Your comment has been added"));
});
