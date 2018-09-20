import userService from './user.service';
import IUser from './user.interface';

export default class userController {

    /**
     * Creates a new user in the database.
     * @param user User to save
     */
    static create(user: IUser) {
        return userService.create(user);
    }
}