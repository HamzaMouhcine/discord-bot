const codes = [ "af", "ar", "as", "bg", "bn", "bs", "ca", "cs", "cy", "da", "de", "el", "en", "es", "et", "fa", "fi", "fil", "fj", "fr", "ga", "gu", "he", "hi", "hr", "ht", "hu", "id", "is", "it", "ja", "kk", "kmr", "kn", "ko", "ku", "lt", "lv", "mg", "mi", "ml", "mr", "ms", "mt", "mww", "nb", "nl", "or", "otq", "pa", "pl", "prs", "ps", "pt", "pt-pt", "ro", "ru", "sk", "sl", "sm", "sr-Cyrl", "sr-Latn", "sv", "sw", "ta", "te", "th", "tlh-Latn", "tlh-Piqd", "to", "tr", "ty", "uk", "ur", "vi", "yua", "yue", "zh-Hans", "zh-Hant"];

module.exports = (client, message, user, args) => { 
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
}
