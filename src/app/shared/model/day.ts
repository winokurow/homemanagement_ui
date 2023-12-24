import {DayEvent} from "./event";

export interface Day {
  id?: string;
  userId?: string;
  day: any;
  state?: any;
  resultEvents: DayEvent[];
  optionalEvents: DayEvent[];
}

