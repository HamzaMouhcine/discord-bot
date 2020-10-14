const User = require('./../models/user');
const auto_off = require('./auto_off.js');
const auto_on = require('./auto_on.js');
const auto_status = require('./auto_status.js');
const auto_reset = require('./auto_reset.js');
const auto_add = require('./auto_add.js');
const auto_remove = require('./auto_remove.js');
const auto_show = require('./auto_show.js');

module.exports = (client, message, args)  => { 
    if (args[0] === undefined) return message.reply("please enter an argument");

    User.findOne({id: message.author.id}, (err, user) => {
      if (err) return message.reply("error");
      if (!user) return message.reply("You don't have an account");

      if (args[0] === "on") {
      	return auto_on(user);

      } else if (args[0] === "off") {
      	return auto_off(user);

      } else if (args[0] === "status") {
      	return auto_status(client, message, user);

      } else if (args[0] === "reset") {
        return auto_reset(user);

      } else if (args[0] === "add") {
        return auto_add(client, message, user, args);
        
      } else if (args[0] === "remove") {
        return auto_remove(client, message, user, args);

      } else if (args[0] === "show"){
        auto_show(client, message, user, args);

      } else {
        return message.reply("Something went wrong, Please try again.");
      }
    });
}