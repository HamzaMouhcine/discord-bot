module.exports = (user) => { 
    user.auto.on = true;
    user.save();
	return true;
}
