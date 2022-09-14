module.exports = {
    once: false,
    name: 'interactionCreate',
    execute: async (interaction, client) => {
        if (interaction.isCommand()) {
            const command = client.slashCommands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.log('Error running command: ', interaction.commandName, error.message);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }

        // More interaction types can be handled here (using else if), you can make another module and use it here.
    }
}