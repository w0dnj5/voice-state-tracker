const { Events } = require('discord.js');

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

function calculateDurationMinutes(data) {
    return Math.floor((data.disconnectAt - data.connectAt) / 60_000);
}

module.exports = {
    name: Events.VoiceStateUpdate,
    execute(oldState, newState, client) {
        if(isBot(newState)) return;

        const voiceStatesData = client.voiceStatesData;
        const userId = newState.member.user.id;
        const guildId = newState.guild.id;

        if(isConnected(oldState, newState)) {
            const key = `${userId}-${guildId}`;
            const data = {
                userId: userId,
                guildId: guildId,
                connectAt: new Date(),
                disconnectAt: undefined,
                durationMinutes: undefined
            }

            voiceStatesData.set(key, data);
        }

        if(isDisconnected(oldState, newState)) {
            const key = `${userId}-${guildId}`;
            const data = voiceStatesData.get(key);
            data.disconnectAt = new Date();
            data.durationMinutes = calculateDurationMinutes(data);
            console.log(data);

            if(data.durationMinutes >= 10) {
                client.voiceStateLogsRepository.createLog(data);
            }

            voiceStatesData.delete(key);
        }
    }
}