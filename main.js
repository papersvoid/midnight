const { Client, Collection } = require('discord.js');
const client = new Client({intents: 32767});
const { Token } = require("../bot/Structures/config.json");
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");




require("./Structures/Handlers/Anti-Crash");
require("./Commands/Systems/GiveawaySystems")(client);

client.commands = new Collection();
client.buttons = new Collection();


["Events", "Commands", "Buttons"].forEach(handler => {
    require(`./Structures/Handlers/${handler}`)(client, PG, Ascii);
});


client.login(Token);