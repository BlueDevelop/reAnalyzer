import { Document } from 'mongoose';

export default interface ISettings extends Document {
  colors?: [string];
}
