import {Duration} from "duration-converter";
import {WeightObject} from "./weight-object";

export interface EventTemplate {
  $key: string;
  userId: string;
  name: string;
  weight: number;
  duration: Duration;
  categories: String;
  postProcessing: string;

}

