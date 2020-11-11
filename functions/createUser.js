const User = require('./../models/user.js');

module.exports = async (message) => {
    return await User.findOne({ id: message.author.id }, (err, user) => {
      if (err) {
      	message.reply('error');
      	return "error";
      }
      if (user) {
      	return "user exists";
      }

      let newUser = new User({
        id: message.author.id
      });
      newUser.save();
      return "new user created";
    });
};