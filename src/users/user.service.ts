import User from './user.model';
import Iuser from './user.interface';

export default class UserService {
  /**
   * Creates a user.
   * @param user User to create
   */
  public static create(user: Iuser) {
    return user.save();
  }
}
