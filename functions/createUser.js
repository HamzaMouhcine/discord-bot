const User = require('./../models/user.js');

module.exports = (message) => new Promise((resolve, reject) => {
    User.findOne({ id: message.author.id }, (err, user) => {
      if (err) {
      	message.reply('error');
      	return reject(err);
      }
      if (user) {
      	return resolve (user);
      }

      let newUser = new User({
        id: message.author.id
      });
      newUser.save();
      return resolve(newUser);
    });
});