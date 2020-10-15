const Discord = require('discord.js');

module.exports = (client, message, user, args) => { 
    if (args.length == 1) return message.reply("one argument lacking");
    let channelId = args[1].slice(2).slice(0,-1);

    let channel = client.channels.cache.find(c => c.id === channelId);
    let reply = "";
    if (!user.auto.channels[channel] || user.auto.channels[channel].length === 0) reply = "Ø";
    else reply = user.auto.channels[channel].join(', ');

    const Embed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle("channel: *"+channel.name+"*")
    .setDescription(reply);

    return message.channel.send(Embed);
}
