import User from './user.model';
import IUser from './user.interface';

export default class userService {

    /**
    * Creates a user.
    * @param user User to create
    */
    static create(user: IUser) {
        return user.save();
    }

}
