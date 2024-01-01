export interface DayEvent {
  id?: string;
  userId?: string;
  startTime: Date;
  endTime: Date;
  name: string;
  categories: string;
  type: string;
  day: string;
  postprocess?: string;
}

