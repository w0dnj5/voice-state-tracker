const { EmbedBuilder } = require('discord.js');
const path = require('path');

function getEmbedData(dirname, langCode, embedName) {
    try {
        const langFilePath = path.join(dirname, 'languages', `${langCode}.json`);
        const langData = require(langFilePath);
        return langData[embedName];
    } catch (error) {
        const defaultLangFilePath = path.join(dirname, 'languages', 'en.json');
        const defaultLangData = require(defaultLangFilePath);
        return defaultLangData[embedName];
    }
}

function createEmbedFromData(embedData) {
    if (!embedData) return null;

    const embed = new EmbedBuilder();

    if (embedData.title) embed.setTitle(embedData.title);
    if (embedData.description) embed.setDescription(embedData.description);
    if (embedData.color) embed.setColor(embedData.color);
    if (embedData.url) embed.setURL(embedData.url);

    if (embedData.author_name) {
        embed.setAuthor({
            name: embedData.author_name,
            iconURL: embedData.author_icon_url || undefined,
            url: embedData.author_url || undefined
        });
    }

    if (embedData.thumbnail_url) embed.setThumbnail(embedData.thumbnail_url);
    if (embedData.image_url) embed.setImage(embedData.image_url);

    if (embedData.footer_text) {
        embed.setFooter({
            text: embedData.footer_text,
            iconURL: embedData.footer_icon_url || undefined
        });
    }

    if (embedData.timestamp) embed.setTimestamp();

    if (embedData.fields && Array.isArray(embedData.fields)) {
        embed.addFields(...embedData.fields);
    }

    return embed;
}

module.exports = {
    getEmbedData,
    createEmbedFromData
}