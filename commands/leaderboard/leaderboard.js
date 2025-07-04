const { SlashCommandBuilder } = require('discord.js');
const discordEmbedBuilder = require('../../utils/discord-embed-builder.js');

const COMMAND_NAME = '리더보드';
const COMMAND_DESCRIPTION = '서버 내 순위를 알려드립니다.';

const FIRST = 1;
const SECOND = 2;
const THIRD = 3;

const GOLD_MEDAL = '🥇';
const SLIVER_MEDAL = '🥈';
const BRONZE_MEDAL = '🥉';

const LEADERBOARD_TITLE = '서버 순위표';
const LEADERBOARD_COLOR = '#E74C3C';
const TOTAL_VOICE_TIME_RANK_FIELD_NAME = '누적 접속시간 TOP 3'
const THIS_MONTH_VOICE_TIME_RANK = '이번 달 접속시간 TOP 3'
const LOGS_NOT_FOUND_MESSAGE = '\`기록이 없습니다.\`';

function createLeaderboardEmbed(guildName, totalVoiceTimeRank, thisMonthVoiceTimeRank) {

    const data = { };
    data.title = `\`${guildName}\` ${LEADERBOARD_TITLE}`;
    data.color = LEADERBOARD_COLOR;
    data.fields = [
        {
            name: TOTAL_VOICE_TIME_RANK_FIELD_NAME,
            value: createVoiceTimeFieldValue(totalVoiceTimeRank),
            inline: false
        },
        {
            name: THIS_MONTH_VOICE_TIME_RANK,
            value: createVoiceTimeFieldValue(thisMonthVoiceTimeRank),
            inline: false
        }
    ];
    data.timestamp = true;

    return discordEmbedBuilder.embedFromData(data);
}

function createVoiceTimeFieldValue(data) {
    if(IsNotFound(data)) {
        return LOGS_NOT_FOUND_MESSAGE;
    }

    let value = '';
    for(i = 0; i < data.length; i++) {    
        const grade = i + 1;
        value += (`\`${sortMedal(grade)} ${grade}등.\` <@${data[i].userId}> \`${calculateHours(data[i].durationMinutes)}시간 ${calculateMinutes(data[i].durationMinutes)}분\`\n`);
    }
    return value;
}

function IsNotFound(data) {
    return data.length == 0;
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

function getStartOfCurrentMonth(now) {
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

function getEndOfCurrentMonth(now) {
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
}

module.exports = {
    name: COMMAND_NAME,
    description: COMMAND_DESCRIPTION,
    data: new SlashCommandBuilder()
        .setName(COMMAND_NAME)
        .setDescription(COMMAND_DESCRIPTION),
    async execute(interaction, client) {
        
        const guildName = interaction.guild.name
        const guildId = interaction.guildId;

        const { voiceStateLogsRepository } = client.repositories;
        const totalVoiceTimeRank = await voiceStateLogsRepository.findTotalVoiceTimeRank(guildId);

        const now = new Date();
        const start = getStartOfCurrentMonth(now);
        const end = getEndOfCurrentMonth(now);

        const thisMonthVoiceTimeRank = await voiceStateLogsRepository.findThisMonthVoiceTimeRank(guildId, start, end);

        const embed = createLeaderboardEmbed(guildName, totalVoiceTimeRank, thisMonthVoiceTimeRank);

         await interaction.reply({ 
            embeds: [embed],
            ephemeral: false
        });
    },
}