import userService from './user.service';
import Iuser from './user.interface';

export default class UserController {
  /**
   * Creates a new user in the database.
   * @param user User to save
   */
  public static create(user: Iuser) {
    return userService.create(user);
  }

  public static update(user: Iuser) {
    return userService.update(user);
  }
}
