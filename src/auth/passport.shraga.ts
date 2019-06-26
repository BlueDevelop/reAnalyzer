import getConfig from '../config';
const config = getConfig();
const { Strategy } = require('passport-shraga');
import User from '../users/user.model';
import { doesNotReject } from 'assert';

const strategyGenerator = () =>
  new Strategy(config.shraga as any, async (profile: any, done: any) => {
    console.log('in shraga');
    console.log(profile);
    const data = profile;
    try {
      let user = await User.findOne({ uniqueId: data.id });
      if (!user) {
        let userToSave = new User({
          uniqueId: data.id,
          name: `${data.name.firstName} ${data.name.lastName}`,
        });
        user = await userToSave.save();
      } else {
        user.uniqueId = data.id;
        user.name = `${data.name.firstName} ${data.name.lastName}`;
        await user.save();
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

export default strategyGenerator;
