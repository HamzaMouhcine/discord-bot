const User = require('./../models/user.js');

module.exports = (message) => { 
    User.findOne({ id: message.author.id }, (err, user) => {
      if (err) return message.reply('error');
      if (user) return;
      let newUser = new User({
        id: message.author.id
      });
      newUser.save();
    });
}