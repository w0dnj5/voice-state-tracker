const { EmbedBuilder } = require('discord.js');
const path = require('node:path');

const EMBED_FOLDER_NAME = 'lang';

function findData(dirname, lang) {
    const filePath = path.join(dirname, EMBED_FOLDER_NAME, `${lang}.json`);
    return require(filePath);
}

function embedFromData(data) {
    const embed = new EmbedBuilder();
    
    if(data.title) {
        embed.setTitle(data.title);
    }

    if(data.url) {
        embed.setURL(data.url);
    }

    if(data.color) {
        embed.setColor(data.color);
    }

    if(data.author) {
        const author = data.author;
        embed.setAuthor({
            name: author.name,
            iconURL: author.iconURL,
            url: author.url
        });
    }

    if(data.description) {
        embed.setDescription(data.description);
    }

    if(data.thumbnail) {
        embed.setThumbnail(data.thumbnail);
    }

    if(data.image) {
        embed.setImage(data.image);
    }

    if(data.footer) {
        const footer = data.footer;
        embed.setFooter({
            text: footer.text,
            iconURL: footer.iconURL
        });
    }

    if(data.fields) {
        embed.setFields(data.fields);
    }

    if(data.timestamp) {
        embed.setTimestamp();
    }

    return embed;
}


module.exports = {
    findData,
    embedFromData
}