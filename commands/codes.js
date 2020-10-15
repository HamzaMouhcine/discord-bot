const Discord = require("discord.js");
const unirest = require("unirest");
const Pagination = require('discord-paginationembed');

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

    req.end(function (res) {
      if (res.error) throw new Error(res.error);
      let codes = [];
      for (const property in res.body.translation) {
        codes.push({
          code: property,
          name: res.body.translation[property].name
        });
      }

      const FieldsEmbed = new Pagination.FieldsEmbed()
      .setArray(codes)
      .setAuthorizedUsers([message.author.id])
      .setChannel(message.channel)
      .setElementsPerPage(10)
      .setPageIndicator(true)
      .setDisabledNavigationEmojis(['jump'])
      .formatField("Commands List:",elm => elm.name+": **"+elm.code+"**");

      FieldsEmbed.embed
        .setColor(0x00FFFF);

      FieldsEmbed.build();
    });
}
