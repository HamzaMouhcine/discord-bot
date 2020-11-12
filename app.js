const Discord = require("discord.js");
const config = require("./config.json");
const unirest = require("unirest");
const User = require('./models/user.js');
const mongoose = require('mongoose');

// commands
const codes_command = require('./commands/codes.js');
const auto_command = require('./commands/auto.js');

const auto_message = require('./functions/auto_message.js');
const createUserAccount = require('./functions/createUser.js');
const translate = require('./functions/translate.js');
const Pagination = require('discord-paginationembed');
const client = new Discord.Client();

const prefix = "t:";

client.on("message", async function(message) {
  if (message.author.bot) return;

  try {
    let userExists = await createUserAccount(message);

    if (!message.content.startsWith(prefix)) {
      return auto_message(message);
    }

    const reg = new RegExp(" +");
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.trim().split(reg);
    const command = args.shift().toLowerCase();

    if (command === "codes") {
      return codes_command(message);
    } else if (command === "auto") {
      return auto_command(client, message, args);
    } else {
      return translate(message, args, command);
    }
    
  } catch(err) {
    console.log(err);
  }
});


client.login(config.BOT_TOKEN);
mongoose.connect('mongodb://localhost/discord-bot', {
	useNewUrlParser: true,
	useUnifiedTopology: true
}, () => {
  console.log("connected to db.");
});