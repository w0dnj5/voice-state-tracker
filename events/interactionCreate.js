module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        const command = client.commands.get(interaction.commandName);
        if(!command) return;

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);
        }
    }
}