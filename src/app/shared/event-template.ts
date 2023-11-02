
export interface EventTemplate {
  id?: string;
  userId?: string;
  order: number;
  name: string;
  weight: number;
  duration: number;
  categories: string;
  postprocess: string;
  room?: string;
  category?: string;
}

