module.exports = (user) => { 
    user.auto.on = false;
    user.save();
    return false;
}
