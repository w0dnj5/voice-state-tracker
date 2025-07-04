const { Events } = require('discord.js');

const MIN_VOICE_DURATION = 30;

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

        // 유저가 연결에 성공했다면 캐시에 접속한 데이터를 적재합니다.
        if(isConnected(oldState, newState)) {
            const key = `${userId}-${guildId}`;
            const data = {
                userId: userId,
                guildId: guildId,
                // 접속시간 데이터를 추가합니다.
                connectedAt: new Date(),
            }

            voiceStatesData.set(key, data);
        }

        // 유저가 연결을 종료했다면 해당 정보에 접속이 종료된 시간을 추가 후 데이터베이스에 적재합니다. 기존의 캐시는 삭제합니다.
        if(isDisconnected(oldState, newState)) {
            const key = `${userId}-${guildId}`;
            const data = voiceStatesData.get(key);
            data.disconnectedAt = new Date();

            // 시간 제한을 통해서 시간 내 접속이 종료된 유저는 기록하지 않도록 설정할 수 있습니다.
            if(isVaildDuration(data)) {
                const { voiceStateBuffer } = client.buffers;
                voiceStateBuffer.push(data);
            }
            voiceStatesData.delete(key);
        }
    }
}