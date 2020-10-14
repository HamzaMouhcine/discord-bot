module.exports = (user) => { 
    user.auto.on = false;
    user.auto.global = [];
    user.auto.channels = {};
    user.markModified('auto');
    user.save();
}