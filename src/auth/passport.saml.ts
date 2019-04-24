import getConfig from '../config';
const config = getConfig();
import { Strategy } from 'passport-saml';
import User from '../users/user.model';
import { doesNotReject } from 'assert';

const strategyGenerator = () =>
  new Strategy(config.saml as any, async (profile: any, done: any) => {
    const data = {
      id: profile[config.samlClaimMapper.id],
      firstName: profile[config.samlClaimMapper.firstName],
      lastName: profile[config.samlClaimMapper.lastName],
    };
    try {
      let user = await User.findOne({ uniqueId: data.id });
      if (!user) {
        let userToSave = new User({
          uniqueId: data.id,
          name: `${data.firstName} ${data.lastName}`,
        });
        user = await userToSave.save();
      } else {
        user.uniqueId = data.id;
        user.name = `${data.firstName} ${data.lastName}`;
        await user.save();
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

export default strategyGenerator;
