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

  /**
   * Creates a user.
   * @param user User to create
   */
  public static async update(user: Iuser) {
    return User.updateOne({ _id: user._id }, user).exec();
  }

  /**
   * Creates a user.
   * @param user User to create
   */
  public static async find(userId: any) {
    return User.findById(userId).exec();

    /**
     *     User.findById(userId, (err, res) => {
      if (err) {
        throw err;
      } else {
        console.log('FOUND USER');
        console.log(res);
        return res;
      }
    });
     * 
     */
  }
}
