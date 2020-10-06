const { Schema, model } = require('mongoose');

const User = Schema({
	id: String,
	displayname: {default: 'User', type: String},
	username: String
});

User.methods.name = function() {
  return this.displayname || this.username;
};

module.exports = model('User', User); 
