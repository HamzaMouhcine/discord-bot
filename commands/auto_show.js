module.exports = (client, message, user, args) => { 
    if (args.length == 1) return message.reply("one argument lacking");
    let channelId = args[1].slice(2).slice(0,-1);

    let channel = client.channels.cache.find(c => c.id === channelId);
    if (!user.auto.channels[channel]) return message.reply("empty channel");
    else return message.reply(user.auto.channels[channel]);
}
