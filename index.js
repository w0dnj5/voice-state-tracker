const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { PrismaClient } = require('./generated/prisma');
const { loadAllCommands } = require('./utils/commandLoader.js');
const { loadAllEvents } = require('./utils/eventLoader.js');
const VoiceStateLogsRepository = require('./repository/voiceStateLogsRepository.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
    ]
});
const prisma = new PrismaClient();

client.commands = new Collection();
client.voiceStatesData = new Map();
client.voiceStateLogsRepository = new VoiceStateLogsRepository(prisma);

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