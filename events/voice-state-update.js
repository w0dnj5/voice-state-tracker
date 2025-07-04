const { Events } = require('discord.js');

const MIN_VOICE_DURATION = 0;

function isBot(state) {
    return state.member.user.bot;
}

function isConnected(oldState, newState) {
    return (!oldState.channelId && newState.channelId && !isAfkChannel(newState)) ||
        (isAfkChannel(oldState) && newState.channelId && !isAfkChannel(newState));
}

function isDisconnected(oldState, newState) {
    return oldState.channelId && !isAfkChannel(oldState) && (!newState.channelId || isAfkChannel(newState));
}

function isAfkChannel(state) {
    return state.channelId && (state.channelId === state.guild.afkChannelId);
}

function isVaildDuration(data) {
    return (data.disconnectedAt - data.connectedAt) / 1000 >= MIN_VOICE_DURATION;
}

module.exports = {
    name: Events.VoiceStateUpdate,
    execute(oldState, newState, client) {
        if(isBot(newState)) return;

        const { voiceStatesData } = client.maps;
        const userId = newState.member.user.id;
        const guildId = newState.guild.id;

        if(isConnected(oldState, newState)) {
            const key = `${userId}-${guildId}`;
            const data = {
                userId: userId,
                guildId: guildId,
                connectedAt: new Date(),
            }

            voiceStatesData.set(key, data);
        }

        if(isDisconnected(oldState, newState)) {
            const key = `${userId}-${guildId}`;
            const data = voiceStatesData.get(key);
            data.disconnectedAt = new Date();

            if(isVaildDuration(data)) {
                const { voiceStateLogsRepository } = client.repositories;
                voiceStateLogsRepository.createVoiceStateLog(data);
            }

            voiceStatesData.delete(key);
        }
    }
}