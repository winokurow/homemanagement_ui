import {DayEvent} from "./event";

export interface Day {
  id?: string;
  userId?: string;
  day: any;
  state: undefined|'created'|'events_inserted'|'generated';
  resultEvents: DayEvent[];
  optionalEvents: DayEvent[];
}

