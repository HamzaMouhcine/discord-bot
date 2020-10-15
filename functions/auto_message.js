const Discord = require('discord.js');
const unirest = require('unirest');
const User = require('./../models/user.js');

module.exports = (message) => { 
    let line = message.content;

    User.findOne({id: message.author.id}, (err, user) => {
      if (err || !user || !user.auto.on) return;

      let languages = [];
      user.auto.global.forEach(lan => languages.push(lan));

      if (user.auto.channels[message.channel] !== undefined) {
        user.auto.channels[message.channel].forEach(lan => {
          if (!languages.includes(lan)) languages.push(lan);
        })
      }

      languages.forEach(lan => {
        var req = unirest("POST", "https://microsoft-translator-text.p.rapidapi.com/translate");
        let to = lan;



        req.query({
          "profanityAction": "NoAction",
          "textType": "plain",
          "to": to,
          "api-version": "3.0"
        });

        req.headers({
          "x-rapidapi-host": "microsoft-translator-text.p.rapidapi.com",
          "x-rapidapi-key": "78a9426abfmsh61f931729fbdc0cp1fa633jsn5091cc4ef462",
          "content-type": "application/json",
          "accept": "application/json",
          "useQueryString": true
        });

        req.type("json");
        req.send([
          {
            "Text": line
          }
        ]);

        req.end(function (res) {
          if (res.error || res.body[0] === undefined) return message.reply('Something went wrong, Please try again.');

          const Embed = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle('to '+to+":")
          .setDescription(res.body[0].translations[0].text);

          message.channel.send(Embed);
        });
      });
    });

    return;
}
