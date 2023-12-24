export interface DayEvent {
  id?: string;
  userId?: string;
  startTime: any;
  endTime: any;
  name: string;
  categories: string;
  type: string;
  day: string;
  postprocess?: string;
}

