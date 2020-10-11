const Discord = require("discord.js");
const config = require("./config.json");
const unirest = require("unirest");
const User = require('./models/user');
const mongoose = require('mongoose');

const client = new Discord.Client();

const prefix = "t:";
const codes = [ "af", "ar", "as", "bg", "bn", "bs", "ca", "cs", "cy", "da", "de", "el", "en", "es", "et", "fa", "fi", "fil", "fj", "fr", "ga", "gu", "he", "hi", "hr", "ht", "hu", "id", "is", "it", "ja", "kk", "kmr", "kn", "ko", "ku", "lt", "lv", "mg", "mi", "ml", "mr", "ms", "mt", "mww", "nb", "nl", "or", "otq", "pa", "pl", "prs", "ps", "pt", "pt-pt", "ro", "ru", "sk", "sl", "sm", "sr-Cyrl", "sr-Latn", "sv", "sw", "ta", "te", "th", "tlh-Latn", "tlh-Piqd", "to", "tr", "ty", "uk", "ur", "vi", "yua", "yue", "zh-Hans", "zh-Hant"];

client.on("message", function(message) {
  if (message.author.bot) return;
  
  if (!message.content.startsWith(prefix)) {
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
          if (res.error) console.log(res.error);
          if (res.body[0] == undefined) message.reply('Something went wrong, Please try again.');
          else {
            message.reply(res.body[0].translations[0].text);
          }
        });
      });
    });

    return;
  }

  let reg = new RegExp(" +");
  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.trim().split(reg);
  console.log(args);
  const command = args.shift().toLowerCase();
  let line = message.content.slice(prefix.length+command.length+1);

  if (command === "create") {
  	User.findOne({ id: message.author.id }, (err, user) => {
      if (err) return message.reply('error');
      if (user) return message.reply('You already have an account!');
      let newUser = new User({
        id: message.author.id
      });
      newUser.save();
      console.log("newUser: "+newUser);
      return message.reply('You have created an account!');
    });


  } else if (command === "name") {
  	User.findOne({ id: message.author.id }, (err, user) => {
      if (err) return message.reply('error');
      if (!user) return message.reply('Create an account first.');
      console.log(user);
      return message.reply('Your name is '+user.name());
    });


  } else if (command === "setname") {
  	let newName = args[0];
    User.findOne({ id: message.author.id }, (err, user) => {
      if (err) return message.reply("error");
      if (!user) return message.reply("Create an account first.");
      user.displayname = newName;
      user.save();
      console.log(user);
      message.reply("Your name is set to "+user.name());
    });


  } else if (command === "delete") {
  	User.deleteOne({ id: message.author.id }, (err, done) => {
      if (err) return message.reply('error');
      if (done.deletedCount == 1) return message.reply('Account deleted');
      else return message.reply("You don't have an account.");
    });


  } else if (command === "ping") {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);


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
      let test = "";
      for (const property in res.body.translation) {
        s = s+res.body.translation[property].name+": "+property+"\n";
        test = test+", \""+property+"\"";
      }
      message.reply(s);
      return message.reply(test);
    });


  } else if (command === "auto") {
    if (args[0] === undefined) return message.reply("please enter an argument");
    console.log("I'm in auto");
    let channeltest;

    User.findOne({id: message.author.id}, (err, user) => {
      if (err) return message.reply("error");
      if (!user) return message.reply("You don't have an account");

      if (args[0] === "on") {
        user.auto.on = true;
        user.save();
        return true;
      } else if (args[0] === "off") {
        user.auto.on = false;
        user.save();
        return false;
      } else if (args[0] === "add") {
        console.log("entered add");
        let all = true,
            error = false,
            channels = [],
            languages = [];

        for (let i = 1; i < args.length; i++) {
          console.log(i+" "+args[i]);
          args[i] = args[i].trim();
          console.log(i+" "+args[i]);
          if (!all) {
            if (args[i].length <= 3) {
              error = true; 
              break;
            }
            let channelId = args[i].slice(2).slice(0, -1);
            let channel = client.channels.cache.find(c => c.id === channelId);
            if (!channel) {
              error = true;
              break;
            }
            if (!channels.includes(channel)) channels.push(channel);
          } else {
            if (!codes.includes(args[i])) {
              if (i == 1) {
                error = true;
                break;
              }
              all = false;
              i--;
            } else {
              if (!languages.includes(args[i])) languages.push(args[i]);
            }
          }
        }
        if (error) return message.reply("You have entered a wrong language code/channel name, Please try again.");

        if (all) {
          languages.forEach(lan => {
            if (!user.auto.global.includes(lan)) user.auto.global.push(lan);
          });
        } else {
          channels.forEach(channel => {
            if (user.auto.channels[channel] === undefined) {
              user.auto.channels[channel] = [];
            }

            languages.forEach(lan => {
              if (!user.auto.channels[channel].includes(lan)) {
                user.auto.channels[channel].push(lan);
              }
            });
          });
        }

        user.markModified('auto');
        user.save();
        return true;
      } else if (args[0] === "remove") {
        let all = true,
            error = false,
            channels = [],
            languages = [];

        for (let i = 1; i < args.length; i++) {
          args[i] = args[i].trim();
          if (!all) {
            if (args[i].length <= 3) {
              error = true; 
              break;
            }
            let channelId = args[i].slice(2).slice(0, -1);
            let channel = client.channels.cache.find(c => c.id === channelId);
            if (!channel) {
              error = true;
              break;
            }
            if (!channels.includes(channel)) channels.push(channel);
          } else {
            if (!codes.includes(args[i])) {
              if (i == 1) {
                error = true;
                break;
              }
              all = false;
              i--;
            } else {
              if (!languages.includes(args[i])) languages.push(args[i]);
            }
          }
        }
        if (error) return message.reply("You have entered a wrong language code/channel name, Please try again.");

        if (all) {
          languages.forEach(lan => {
            const idx = user.auto.global.indexOf(lan);
            if (idx != -1) user.auto.global.splice(idx, 1);
          });
        } else {
          channels.forEach(channel => {
            if (user.auto.channels[channel] === undefined) {
              user.auto.channels[channel] = [];
            }

            languages.forEach(lan => {
              const idx = user.auto.channels[channel].indexOf(lan);
              if (idx != -1) user.auto.channels[channel].splice(idx, 1);
            });
          });
        }

        user.markModified('auto');
        user.save();
        return true;
      } else if (args[0] === "show"){
        if (args.length == 1) return message.reply("one argument lacking");
        let channelId = args[1].slice(2).slice(0,-1);

        let channel = client.channels.cache.find(c => c.id === channelId);
        if (!user.auto.channels[channel]) return message.reply("empty channel");
        else return message.reply(user.auto.channels[channel]);
      } else {
        return message.reply("Something went wrong, Please try again.");
      }


      client.channels.cache.each(a => {
        console.log("hey "+a.name);
      });
      console.log(client.channels.cache.keyArray());
      console.log(args[1].slice(2).slice(0,-1));
      let channelname = args[1].slice(2).slice(0,-1);
      console.log(channelname);
      client.channels.cache.find(c => c.id === "753625964402966559" ).send("hello general booo");
      client.channels.cache.find(c => c.id === channelname ).send("hello general booo");
      let channel = client.channels.cache.get("752273801584050239");
      channel.send("heaaeyayoeak "+channel.name+", "+message.channel.name+" "+args[1]+" "+channelname);
      console.log("channel: "+client.channels.cache.get("753625964402966559"));

      return;
    });

  } else {
    var req = unirest("POST", "https://microsoft-translator-text.p.rapidapi.com/translate");
    console.log("hello, I'm in else");
    console.log(command);
    let from = "",
        to = command;

    if (args.length != 0 && args[0].startsWith("!")) {
      from = from+args[0].slice(1);
      line = message.content.slice(prefix.length+command.length+1+from.length+1);
    }


    req.query({
      "from" : from,
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
      if (res.error) console.log(res.error);
      if (res.body[0] == undefined) message.reply('Something went wrong, Please try again.');
      else {
        console.log(res.body[0].translations[0].text);
        message.reply(res.body[0].translations[0].text);
      }
    });
  }

});


client.login(config.BOT_TOKEN);
mongoose.connect('mongodb://localhost/discord-bot', {
	useNewUrlParser: true,
	useUnifiedTopology: true
}, () => {
  console.log("connected to db.");
}); 
