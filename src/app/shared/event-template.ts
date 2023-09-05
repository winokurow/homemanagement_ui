
export interface EventTemplate {
  id?: string;
  userId?: string;
  order: number;
  name: string;
  weight: number;
  duration: number;
  categories: string;
  postProcessing: string;
  category?: string;
}

