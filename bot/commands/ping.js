const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with client\'s WebSocket ping latency!'),
    execute: async (interaction, client) => {
        let ping = client.ws.ping;
        
        await interaction.reply({ content: `:ping_pong: Pong! WebSocket ping is \`${ping} ms\``, ephemeral: true });
    }
}