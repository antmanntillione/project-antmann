export type Language = "german" | "english";

export type PrivilegeLevel = "USER" | "ADMIN";

export interface User {
  username: string;
  id: number;
  language: Language;
  privilege_level: PrivilegeLevel;
}

export interface NewUser {
  user: User;
  one_time_password: string;
}

export type DataSetSorting = "sort_by_name" | "sort_by_upload_date";

// additional_params: {'num_instances', 'num_samples', 'feature_names', 'preprocessing_necessary', 'geo_referenced'} --> timeseries / timeseries_georeferenced dataset
// additional_params: {'num_images'} --> image dataset
export interface Dataset {
  name: string;
  id: number;
  upload_date: string;
  dataset_type: string;
  additional_params: {
    [name: string]: any;
  };
}

export type DatasetWithClassifier = Dataset & {
  compatible_classifiers: Array<[string, string]>;
};

export interface Classifier {
  name: string;
  uuid: string;
  framework: string;
  xai_models: Array<XAIModel>;
  datasets: Array<Dataset>;
  compatible_dataset_type: string;
}

export interface XAIModel {
  name: string;
  uuid: string;
  local: boolean;
  global: boolean;
  parameters: Array<ParameterDescription>;
}

export type ParameterDescription =
  | ChoiceParameterDescription
  | IntegerParameterDescription;

export type Parameter = string | number;

export interface ChoiceParameterDescription {
  name: string;
  type: "choice";
  description: {
    choices: Array<string>;
    default: string;
  };
}

export interface IntegerParameterDescription {
  name: string;
  type: "int";
  description: {
    min: number;
    max: number;
    step: number;
    default: number;
  };
}

export type RatingView = "user" | "all";

export interface RatingStatistic {
  number_of_ratings: number;
  average_rating: number;
  number_of_users: number;
  rating_matrix: {
    xai_models: Array<string>;
    classifiers: Array<string>;
    values: Array<Array<number>>;
  };
}

export interface Rating {
  xai_model: string;
  classifier: string;
  dataset: string;
  creator: string;
  rating: number;
  comment: string;
}

export type Instance = Array<Array<number>>;

export interface XAIModelResult {
  name: string;
  diagram_types: Array<string>;
  result: number[][] | number[][][];
}

export interface ClassifierInstance {
  ground_truth: string;
  classification: {
    [name: string]: number;
  };
}

export interface JobExplanationResult {
  feature_names: Array<string>;
  instances: Array<ClassifierInstance>;
  models: Array<XAIModelResult>;
}

export interface JobExplanationResultImages {}
export interface JobClassificationResultImages {}
