const { SlashCommandBuilder, Locale } = require('discord.js');
const { createEmbedFromData, getEmbedData } = require('../../utils/embedBuilder.js')

module.exports = {
    name: 'donate',
    description: 'donate for developer',
    data: new SlashCommandBuilder()
        .setName('donate')
        .setNameLocalizations({
            [Locale.Korean]: '후원'
        })
        .setDescription('donate for developer')
        .setDescriptionLocalizations({
            [Locale.Korean]: '개발자에게 후원하기'
        }),
    async execute(interaction) {
        
        const userLocale = interaction.locale;
        const embedData = getEmbedData(__dirname, userLocale, 'donation_embed')
        const embed = createEmbedFromData(embedData);

         await interaction.reply({ 
            embeds: [embed],
            ephemeral: true
        });
    },
}