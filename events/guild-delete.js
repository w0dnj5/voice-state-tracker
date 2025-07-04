const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildDelete,
    execute(guild, client) {
        // 서버에서 봇이 추방되면 해당 서버의 기록을 삭제합니다.
        const { voiceStateLogsRepository } = client.repositories;
        voiceStateLogsRepository.deleteLogsByGuildId(guild.id);
    }
}