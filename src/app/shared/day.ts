import {DayEvent} from "./event";

export interface Day {
  id?: string;
  userId?: string;
  day: Date;
  optionalEvents: DayEvent[];
  mandatoryEvents: DayEvent[];
  resultEvents: DayEvent[];
}

