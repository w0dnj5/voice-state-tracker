const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder.js');

function createDonationEmbed() {

    const jsonObject = embedBuilder.findJsonObject(__dirname, 'ko');
    return embedBuilder.embedFromJson(jsonObject);
}

module.exports = {
    name: '후원',
    description: '개발자에게 후원하기',
    data: new SlashCommandBuilder()
        .setName('후원')
        .setDescription('개발자에게 후원하기'),
    async execute(interaction) {
        
        const embed = createDonationEmbed();

        await interaction.reply({ 
            embeds: [embed],
            ephemeral: true
        });
    },
}