import {DayEvent} from "./event";

export interface Day {
  id?: string;
  userId?: string;
  day: Date;
  state?: any;
  resultEvents: DayEvent[];
  optionalEvents: DayEvent[];
}

