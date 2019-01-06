const logger = require('./logger'),
    UserSchema = require('../user/userSchema'),
    RequestSchema = require('../request/requestSchema'),
    users = require('../user/mockdata'),
    requests = require('../request/mockdata');

exports.initDB = async () => {
  logger.log('Seeding the DB');
  await RequestSchema.find({}).deleteMany().exec();
  await UserSchema.find({}).deleteMany().exec();
  await RequestSchema.create(requests);
  await UserSchema.create(users);
};
