declare module './api/activities/models/Activity' {
  import { Model, Document } from 'mongoose';
  
  export interface IActivity extends Document {
    date: string;
    name: string;
    description: string;
  }
  
  export const Activity: Model<IActivity>;
}

