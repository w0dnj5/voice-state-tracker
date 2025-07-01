const fs = require('node:fs');
const path = require('node:path');

function loadAllEvents() {
    const events = [];
    const eventsPath = path.join(__dirname, '../events');
    const eventFiles = loadEventFiles(eventsPath);

    eventFiles.forEach(file => {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);

        events.push(event);
    });
    return events;
}

function loadEventFiles(eventsPath) {
    return fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
}

module.exports = {
    loadAllEvents,
}