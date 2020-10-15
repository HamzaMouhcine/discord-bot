const Pagination = require('discord-paginationembed');

module.exports = (client, message, user) => { 
	let status = [];
	status.push({
		channel: "global",
		languages: user.auto.global
	});
    for (let channel in user.auto.channels) {
      let channelId = channel.slice(2).slice(0, -1);
      let channelName = client.channels.cache.find(c => c.id === channelId).name;
      status.push({
      	channel: channelName,
      	languages: user.auto.channels[channel].join(', ')
      });
    }

    const FieldsEmbed = new Pagination.FieldsEmbed()
    .setArray(status)
    .setAuthorizedUsers([message.author.id])
    .setChannel(message.channel)
    .setElementsPerPage(10)
    .setPageIndicator(true)
    .formatField("Auto status:",elm => elm.channel+": "+elm.languages);

	FieldsEmbed.embed
	.setColor(0x00FFFF);

	return FieldsEmbed.build();
}
