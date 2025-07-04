const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { PrismaClient } = require('./generated/prisma');
const { loadAllCommands } = require('./utils/discord-command-loader.js');
const { loadAllEvents } = require('./utils/discord-event-loader.js');
const VoiceStateLogsRepository = require('./repository/voice-state-logs-repository.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
    ]
});
const prisma = new PrismaClient();

client.commands = new Collection();

// 캐시 데이터
client.maps = {
    voiceStatesData: new Map(),
    leaderboardData: new Map()
}

// 음성채널 접속기록 임시 버퍼
client.buffers = {
    voiceStateBuffer: []
}

// 데이터베이스 객체
client.repositories = {
    voiceStateLogsRepository: new VoiceStateLogsRepository(prisma)
}

function init() {
    const loadedCommands = loadAllCommands();

    loadedCommands.forEach(command => client.commands.set(command.data.name, command));

    const loadedEvents = loadAllEvents();

    loadedEvents.forEach(event => {
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    })
}

async function updateVoiceState() {
    const { voiceStateBuffer } = client.buffers;
    if (voiceStateBuffer.length > 0) {
        await saveVoiceState(voiceStateBuffer);
        voiceStateBuffer.length = 0;
    }
}

async function saveVoiceState(voiceStateBuffer) {
    try {
        const { voiceStateLogsRepository } = client.repositories;
        const count = await voiceStateLogsRepository.createVoiceStateLogs(voiceStateBuffer);
        console.log(`[DB] ${count}개의 음성 로그가 성공적으로 DB에 저장되었습니다.`);
        
    } catch (error) {
        console.log(error);
    }
}

function updateLeaderboard() {
    const { leaderboardData } = client.maps;
    leaderboardData.clear();
}

init();

// 30초마다 DB를 업데이트합니다.
setInterval(updateVoiceState, 30 * 1000);
// 1시간마다 리더보드를 갱신합니다.
setInterval(updateLeaderboard, 60 * 60 * 1000);

// 프로그램 종료 시 prisma 프로세스를 종료시킵니다.
process.on('SIGINT', async () => {
    updateVoiceState();
    await prisma.$disconnect();
    process.exit(0);
});

client.login(process.env.DISCORD_TOKEN);