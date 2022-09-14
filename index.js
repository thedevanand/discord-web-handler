const { join } = require('path');
const { readdirSync, readFileSync } = require('node:fs');
const config = require('./config.json');

// Initialize database connection

const mongoose = require('mongoose');

mongoose
    .connect(
        config.database.mongodb.uri + '/' + config.database.mongodb.database,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(async () => {
        console.log(`Connected to MongoDB [${config.database.mongodb.database}]`);
    })
    .catch(err => console.error(err));


// Initialize Discord.js client

const { Client, Collection, GatewayIntentBits } = require('discord.js');

// Use needed Gateway Intents

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        // GatewayIntentBits.GuildBans,
        // GatewayIntentBits.GuildEmojisAndStickers,
        // GatewayIntentBits.GuildIntegrations,
        // GatewayIntentBits.GuildWebhooks,
        // GatewayIntentBits.GuildInvites,
        // GatewayIntentBits.GuildVoiceStates,
        // GatewayIntentBits.GuildPresences,
        // GatewayIntentBits.GuildMessages,
        // GatewayIntentBits.GuildMessageReactions,
        // GatewayIntentBits.GuildMessageTyping,
        // GatewayIntentBits.DirectMessages,
        // GatewayIntentBits.DirectMessageReactions,
        // GatewayIntentBits.DirectMessageTyping,
        // GatewayIntentBits.MessageContent,
        // GatewayIntentBits.GuildScheduledEvents
    ]
});

// Handle command files

client.slashCommands = new Collection();

for (const file of readdirSync('./bot/commands')) {
    if (!file.endsWith('.js')) continue;
    
    const command = require(`./bot/commands/${file}`);
    client.slashCommands.set(command.data.name, command);
}

// Handle event files

for (const file of readdirSync('./bot/events')) {
    if (!file.endsWith('.js')) continue;
    const event = require(`./bot/events/${file}`);

    if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
    else client.on(event.name, (...args) => event.execute(...args, client));
}

client.login(config.discord.token);

// Initialize http server

const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const { Edge } = require('edge.js');
const edge = new Edge({ cache: config.application.environment == 'production', });

// Un-comment this if using edge directly without express
// edge.mount(resolve(__dirname, './web/views'));

app.engine('edge', (filePath, options, callback) => {
    edge.render(filePath, options).then((html) => callback(null, html));
});

app.set('views', join(__dirname, './web/views'));
app.set('view engine', 'edge')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('public', express.static(join(__dirname, './web/assets')));

app.get('/', (req, res) => {
    res.render('index', { message: 'Hello web!' });
});

app.get('*', (req, res) => {
    res.status(404).render('errors/404', { message: 'Page not found!' });
})

app.listen(config.http.port, () => {
    console.log(`HTTP Server running on port [${config.http.port}]`);
});