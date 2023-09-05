import {Duration} from "duration-converter";
import {WeightObject} from "./weight-object";

export interface EventTemplate {
  id?: string;
  userId?: string;
  name: string;
  weight: number;
  duration: number;
  categories: string;
  postProcessing: string;
}

