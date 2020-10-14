const Discord = require("discord.js");
const unirest = require("unirest");

module.exports = (message) => { 
    var req = unirest("GET", "https://microsoft-translator-text.p.rapidapi.com/languages");

    req.query({
      "api-version": "3.0"
    });

    req.headers({
      "x-rapidapi-host": "microsoft-translator-text.p.rapidapi.com",
      "x-rapidapi-key": "78a9426abfmsh61f931729fbdc0cp1fa633jsn5091cc4ef462",
      "useQueryString": true
    });

    const Embed = new Discord.MessageEmbed().setColor('#0099ff')
                                            .setTitle('Some title');


    req.end(function (res) {
      if (res.error) throw new Error(res.error);
      let s = "";
      for (const property in res.body.translation) {
        s = s+res.body.translation[property].name+": "+property+"\n";
        Embed.addField(res.body.translation[property].name, property);
      }
      message.channel.send(s);
      message.channel.send(Embed);
      return;
    });
}
