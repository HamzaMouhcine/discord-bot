module.exports = (client, message, user) => { 
	let status = "";
    status = "gobal: "+user.auto.global+"\n";
    for (let channel in user.auto.channels) {
      let channelId = channel.slice(2).slice(0, -1);
      let channelName = client.channels.cache.find(c => c.id === channelId).name;
      status = status+channelName+": "+user.auto.channels[channel]+"\n";
    }
    return message.reply(status);
}
