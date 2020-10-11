const { Schema, model } = require('mongoose');

const User = Schema({
	id: String,
	displayname: {default: 'User', type: String},
	username: String,
	auto: {
		on: {default: false, type: Boolean},
		global: {default: [], type: Array},
		channels: {default: {}, type: Object}
	}
});

User.methods.name = function() {
  return this.displayname || this.username;
};

module.exports = model('User', User); 
