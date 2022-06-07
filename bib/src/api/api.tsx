import {
  Classifier,
  DatasetWithClassifier,
  RatingStatistic,
  Rating,
  NewUser,
  User,
  Language,
  RatingView,
  PrivilegeLevel,
  Instance,
  DataSetSorting,
  Parameter,
  JobExplanationResult,
} from "./api_types";

import Axios, { AxiosInstance, CancelToken, CancelTokenSource } from "axios";
import { config } from "../../package.json";
import { handleLogout } from "../login";

import fileDownload from "js-file-download";

class APIError extends Error {
  error: string;

  constructor(message: string, error: string) {
    super(message);
    this.error = error;
  }
}

class PollingError extends Error {
  polling_error: boolean;
  constructor(message: string, polling_error: boolean) {
    super(message);
    this.polling_error = polling_error;
  }
}

class ArkansasAPI {
  api: AxiosInstance;

  constructor() {
    this.api = Axios.create({
      baseURL: config.baseURL,
      timeout: 10000,
      withCredentials: true,
    });

    /**
     * Intercept 401 - Auth Errors and directly goto login
     */
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          handleLogout();
        } else {
          throw error;
        }
      }
    );

    /**
     * Replace 204 Responses with null responses to streamline handeling
     */
    this.api.interceptors.response.use(
      (response) => {
        if (response.status === 204) {
          response.data = {
            type: "success",
            value: null,
          };
        }
        return response;
      },
      (error) => {
        throw error;
      }
    );

    /**
     * Translate Errors into common ones to streamline error handeling
     */
    this.api.interceptors.response.use(
      (response) => {
        if (response.data?.type === "error") {
          throw new Error(response.data.errorMessage);
        } else if (response.data?.type === "success") {
          response.data = response.data.value;
        }
        return response;
      },
      (error) => {
        if (error.response?.data) {
          if (typeof error.response.data !== "object") {
            alert("Server error");
            return;
          }
          if (
            "type" in error.response.data &&
            "errorMessage" in error.response.data &&
            error.response.data.type === "error"
          ) {
            throw new APIError(
              error.response.data.errorMessage,
              error.response.data.error
            );
          } else {
            throw new Error(error.response.data);
          }
        } else if (error.response) {
          throw new Error("Server error");
        } else if (error.request) {
          throw new Error("No Server response");
        }
      }
    );
  }

  async getLogin(): Promise<User> {
    const response = await this.api.get("/users/login");
    return response.data;
  }

  async login(username: string, password: string): Promise<User> {
    const response = await this.api.post("/users/login", {
      username: username,
      password: password,
    });

    return response.data;
  }

  async logout(): Promise<null> {
    const response = await this.api.post("/users/logout");
    handleLogout();
    return response.data;
  }

  async getClassifiers(): Promise<Array<Classifier>> {
    const response = await this.api.get("/classifiers/");
    return response.data.classifiers;
  }

  async getDatasets(
    sorting: DataSetSorting
  ): Promise<Array<DatasetWithClassifier>> {
    const response = await this.api.get("/datasets/", {
      params: {
        sorting: sorting,
      },
    });
    return response.data;
  }

  async addDataset(
    file: File,
    name: string,
    dataset_type: string,
    feature_names: Array<string>
  ): Promise<null> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("dataset_type", dataset_type);
    for (const feature of feature_names) {
      formData.append("feature_names", feature);
    }
    const response = await this.api.post("/datasets/", formData, {
      timeout: 0,
    });
    return response.data;
  }

  async getInstances(dataset_id: number): Promise<Array<string>> {
    try {
      const response = await this.api.get(`/datasets/${dataset_id}/instances`);
      return response.data.instances;
    } catch (e) {
      throw e;
    }
  }

  async getImagesData(dataset_id: number): Promise<Array<string>> {
    try {
      const response = await this.api.get(`/datasets/${dataset_id}/imagesdata`);
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async getInstance(dataset_id: number, index_id: number): Promise<Instance> {
    const response = await this.api.get(
      `/datasets/${dataset_id}/instances/${index_id}`
    );
    return response.data.selected_instance;
  }

  async setDatasetName(id: number, newName: string): Promise<null> {
    const response = await this.api.put(`/datasets/${id}/name`, {
      name: newName,
    });
    return response.data;
  }

  async deleteDataset(id: number): Promise<null> {
    const response = await this.api.delete(`/datasets/${id}`);
    return response.data;
  }

  async changeCompability(
    id: number,
    classifiers: Array<string>
  ): Promise<null> {
    const response = await this.api.put(`/datasets/${id}/compatibility`, {
      compatibleClassifiers: classifiers,
    });
    return response.data;
  }

  async getStatistics(view: RatingView): Promise<RatingStatistic> {
    const response = await this.api.get("/ratings/statistic/", {
      params: {
        view: view,
      },
    });
    return response.data;
  }

  async getRatings(
    start: number,
    length: number,
    view: RatingView
  ): Promise<Array<Rating>> {
    const response = await this.api.get("/ratings/", {
      params: {
        view: view,
        start: start,
        length: length,
      },
    });
    return response.data;
  }

  getRatingCSV() {
    this.api
      .get("/ratings/csv", {
        responseType: "blob",
      })
      .then((resp) => {
        const filename = resp.headers["content-disposition"]
          .split(";")
          .find((substr: string) => substr.includes("filename="))
          .replace("filename=", "")
          .trim();
        fileDownload(resp.data, filename);
      });
  }

  async addRating(
    rating: number,
    comment: string,
    dataset: number,
    classifier: string,
    xai_model: string
  ): Promise<null> {
    const response = await this.api.post("/ratings/", {
      rating: rating,
      comment: comment,
      dataset: dataset,
      classifier: classifier,
      xai_model: xai_model,
    });
    return response.data;
  }

  async getUsers(): Promise<Array<User>> {
    const response = await this.api.get("/users/");
    return response.data.users;
  }

  async deleteUser(id: number): Promise<null> {
    const response = await this.api.delete(`/users/${id}/`);
    return response.data;
  }

  async addUser(
    username: string,
    privilege: PrivilegeLevel,
    language: Language
  ): Promise<NewUser> {
    const response = await this.api.post(`/users/`, {
      username: username,
      privilege_level: privilege,
      language: language,
    });
    return response.data;
  }

  async changeUserLanguage(id: number, lang: Language): Promise<null> {
    const response = await this.api.put(`/users/${id}/change_language`, {
      new_language: lang,
    });
    return response.data;
  }

  async changePassword(id: number, new_password: string): Promise<null> {
    const response = await this.api.put(`/users/${id}/change_password`, {
      new_password: new_password,
    });
    return response.data;
  }

  async explain_local(
    datasetID: number,
    instanceID: number,
    classifierID: string,
    modelIDs: Array<string>,
    modelSettings: {
      [modelID: string]: {
        [parameterName: string]: Parameter;
      };
    }
  ): Promise<number> {
    const modelTupleList = [];
    for (const id of modelIDs) {
      modelTupleList.push([id, modelSettings[id]]);
    }

    const response = await this.api.post("/explainer/local", {
      dataset: datasetID,
      instance: instanceID,
      classifier: classifierID,
      models: modelTupleList,
    });

    return response.data.JobID;
  }

  async explain_global(
    datasetID: number,
    instance_amount: number,
    classifierID: string,
    modelIDs: Array<string>,
    modelSettings: {
      [modelID: string]: {
        [parameterName: string]: Parameter;
      };
    }
  ): Promise<number> {
    const modelTupleList = [];
    for (const id of modelIDs) {
      modelTupleList.push([id, modelSettings[id]]);
    }

    const response = await this.api.post("/explainer/global", {
      dataset: datasetID,
      instance_amount: instance_amount,
      classifier: classifierID,
      models: modelTupleList,
    });

    return response.data.JobID;
  }

  createCancelToken(): CancelTokenSource {
    return Axios.CancelToken.source();
  }

  isCancel(error: any): boolean {
    return Axios.isCancel(error);
  }

  async getJob(id: number, token: CancelToken): Promise<JobExplanationResult> {
    const response = await this.api.get(`/explainer/${id}/`, {
      cancelToken: token,
    });
    if (response.data !== null) {
      return response.data;
    } else {
      throw new PollingError("Job not finished", true);
    }
  }
}

export const api = new ArkansasAPI();
