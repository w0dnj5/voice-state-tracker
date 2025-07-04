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
client.maps = {
    voiceStatesData: new Map()
}
client.repositories = {
    voiceStateLogsRepository: new VoiceStateLogsRepository(prisma)
}

const loadedCommands = loadAllCommands();

loadedCommands.forEach(command => client.commands.set(command.data.name, command));

const loadedEvents = loadAllEvents();

loadedEvents.forEach(event => {
    if(event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
})

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

client.login(process.env.DISCORD_TOKEN);