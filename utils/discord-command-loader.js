const fs = require('node:fs');
const path = require('node:path');

function loadAllCommands() {
    const commands = [];
    const commandFolderPath = path.join(__dirname, '../commands');
    const commandFolder = loadCommandFolder(commandFolderPath);

    commandFolder.forEach(folder => {
        const commandsPath = path.join(commandFolderPath, folder);
        const commandFiles = loadCommandFiles(commandsPath);

        commandFiles.forEach(file => {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);

            if (isValidCommand(command)) {
                commands.push(command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        });
    });
    return commands;
}

function loadCommandFolder(commandFolderPath) {
    return fs.readdirSync(commandFolderPath);
}

function loadCommandFiles(commandsPath) {
    return fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
}

function isValidCommand(command) {
    return 'data' in command && 'execute' in command;
}

module.exports = {
    loadAllCommands,
}