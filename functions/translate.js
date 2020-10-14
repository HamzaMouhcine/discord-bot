const unirest = require('unirest');
const prefix = "t:";

module.exports = (message, args, command) => { 
    var req = unirest("POST", "https://microsoft-translator-text.p.rapidapi.com/translate");
    let from = "",
        to = command,
        line = message.content.slice(prefix.length+command.length+1);

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
      if (res.error || res.body[0] == undefined) return message.reply('Something went wrong, Please try again.');
      else {
        return message.reply(res.body[0].translations[0].text);
      }
    });
}
