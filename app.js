const Discord = require("discord.js");
const config = require("./config.json");
const unirest = require("unirest");

const client = new Discord.Client();

const prefix = ":";



client.on("message", function(message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();
  const line = message.content.slice(prefix.length+command.length+" ");

  if (command === "ping") {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);

  } else if (command === "translate") {
    var req = unirest("POST", "https://microsoft-translator-text.p.rapidapi.com/translate");

    req.query({
      "profanityAction": "NoAction",
      "textType": "plain",
      "to": "fr",
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
      if (res.error) console.log(res.error);
      console.log(res.body[0].translations[0].text);
      message.reply(res.body[0].translations[0].text);
    });
  } else if (command === "codes") {
    var req = unirest("GET", "https://microsoft-translator-text.p.rapidapi.com/languages");

    req.query({
      "api-version": "3.0"
    });

    req.headers({
      "x-rapidapi-host": "microsoft-translator-text.p.rapidapi.com",
      "x-rapidapi-key": "78a9426abfmsh61f931729fbdc0cp1fa633jsn5091cc4ef462",
      "useQueryString": true
    });


    req.end(function (res) {
      if (res.error) throw new Error(res.error);
      let s = "";
      for (const property in res.body.translation) {
        console.log(property+" hellooeee "+res.body.translation[property].name);
        s = s+res.body.translation[property].name+": "+property+"\n";
      }
      message.reply(s);
    });
  }

});

client.login(config.BOT_TOKEN);