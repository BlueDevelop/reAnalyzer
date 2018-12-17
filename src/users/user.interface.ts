import { Document } from 'mongoose';
import ISettings from './settings.interface';

export default interface IUser extends Document {
  uniqueId: string;
  password?: string;
  name: string;
  settings?: ISettings;
  generateHash(password: string): string;
  validPassword(password: string): boolean;
}
