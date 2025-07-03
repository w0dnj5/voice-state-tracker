const { EmbedBuilder } = require('discord.js');
const path = require('node:path');

const EMBED_FOLDER_NAME = 'lang';

function findJsonObject(dirname, lang) {
    const filePath = path.join(dirname, EMBED_FOLDER_NAME, `${lang}.json`);
    return require(filePath);
}

function embedFromJson(jsonObject) {
    const embed = new EmbedBuilder();
    
    if(jsonObject.title) {
        embed.setTitle(jsonObject.title);
    }

    if(jsonObject.url) {
        embed.setURL(jsonObject.url);
    }

    if(jsonObject.color) {
        embed.setColor(jsonObject.color);
    }

    if(jsonObject.author) {
        const author = jsonObject.author;
        embed.setAuthor({
            name: author.name,
            iconURL: author.iconURL,
            url: author.url
        });
    }

    if(jsonObject.description) {
        embed.setDescription(jsonObject.description);
    }

    if(jsonObject.thumbnail) {
        embed.setThumbnail(jsonObject.thumbnail);
    }

    if(jsonObject.image) {
        embed.setImage(jsonObject.image);
    }

    if(jsonObject.footer) {
        const footer = jsonObject.footer;
        embed.setFooter({
            text: footer.text,
            iconURL: footer.iconURL
        });
    }

    if(jsonObject.fields) {
        embed.setFields(jsonObject.fields);
    }

    if(jsonObject.timestamp) {
        embed.setTimestamp();
    }

    return embed;
}


module.exports = {
    findJsonObject,
    embedFromJson
}