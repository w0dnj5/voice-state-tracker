const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder.js');

const FIRST = 1;
const SECOND = 2;
const THIRD = 3;

const GOLD_MEDAL = '🥇';
const SLIVER_MEDAL = '🥈';
const BRONZE_MEDAL = '🥉';

const LEADERBOARD_TITLE = '서버 순위표';
const LEADERBOARD_COLOR = '#E74C3C';
const TOTAL_VOICE_TIME_TOP_3_FIELD_NAME = '누적 접속시간 TOP 3'
const LOGS_NOT_FOUND_MESSAGE = '기록이 없습니다.';

function createLeaderboardEmbed(guildName, totalVoiceTimeTop3) {

    const jsonObject = { };
    jsonObject.title = `\`${guildName}\` ${LEADERBOARD_TITLE}`;
    jsonObject.color = LEADERBOARD_COLOR;
    jsonObject.fields = [
        {
            name: TOTAL_VOICE_TIME_TOP_3_FIELD_NAME,
            value: createTotalVoiceTimeFieldValue(totalVoiceTimeTop3),
            inline: false
        },
    ];
    jsonObject.timestamp = true;

    return embedBuilder.embedFromJson(jsonObject);
}

function createTotalVoiceTimeFieldValue(totalVoiceTimeTop3) {
    if(totalVoiceTimeTop3.length == 0) {
        return LOGS_NOT_FOUND_MESSAGE;
    }

    let value = '';
    for(i = 0; i < totalVoiceTimeTop3.length; i++) {    
        const grade = i + 1;
        value += (`\`${sortMedal(grade)} ${grade}등.\` <@${totalVoiceTimeTop3[i].userId}> \`${calculateHours(totalVoiceTimeTop3[i].totalDuration)}시간 ${calculateMinutes(totalVoiceTimeTop3[i].totalDuration)}분\`\n`);
    }
    return value;
}

function calculateHours(totalDuration) {
    return Math.floor(totalDuration / 60);
}

function calculateMinutes(totalDuration) {
    return totalDuration % 60;
}

function sortMedal(grade) {
    if(grade == FIRST) {
        return GOLD_MEDAL;
    }
    if(grade == SECOND) {
        return SLIVER_MEDAL;
    }
    if(grade == THIRD) {
        return BRONZE_MEDAL;
    }
    return '';
}

module.exports = {
    name: '랭크',
    description: '서버 내 순위를 알려드립니다.',
    data: new SlashCommandBuilder()
        .setName('랭크')
        .setDescription('서버 내 순위를 알려드립니다.'),
    async execute(interaction, client) {
        
        const guildName = interaction.guild.name
        const guildId = interaction.guildId;

        const { voiceStateLogsRepository } = client.repositories;
        const totalVoiceTimeTop3 = await voiceStateLogsRepository.findTotalVoiceTimeTop3(guildId);

        const embed = createLeaderboardEmbed(guildName, totalVoiceTimeTop3);

         await interaction.reply({ 
            embeds: [embed],
            ephemeral: false
        });
    },
}