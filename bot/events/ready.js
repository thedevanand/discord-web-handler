const config = require('../../config.json');

module.exports = {
    once: true,
    name: 'ready',
    execute: async (client) => {
        console.log(`Connected to Discord CLIENT [${client.user.tag}]`);

        // Parse commands collection to JSON data
        const data = client.slashCommands.map(command => command.data);

        if (config.application.environment == 'local') {
            // Load slash commands for testing servers
            
            for (const guildId of config.discord.testGuilds) {
                try {
                    const guild = client.guilds.cache.get(guildId);
                    if (!guild) continue;
    
                    await guild.commands.set(data);
                } catch (error) {
                    console.log('Error loading slash commands: ', `[${guildId}]`, error.message);
                }
            }
        } else {
            // Load slash commands for globally
            client.application.commands.set(data);
        }
    }
}