const {Perms} = require("../Validations/Permissions")
const {Client} = require("discord.js")

/**
 * @param {Client} client 
 */
module.exports = async (client, PG, Ascii) => {
    const Table = new Ascii("Commands Loaded.");

    CommandsArray = [];

    (await PG(`${process.cwd().replace(/\\/g,"/")}/Commands/*/*.js`)).map(async (file) => {
        const command = require(file);

        if (!command.context && !command.name)
            return Table.addRow(`${file.split("/")[7]}`, "❌ FAILED", `missing name.`);

        if (!command.context && !command.description)
            return Table.addRow(command.name, "❌ FAILED", "missing description.");

        client.commands.set(command.name, command);
        CommandsArray.push(command);

        await Table.addRow(command.name, "✔️ Loaded Successfully!");
    });

    console.log(Table.toString());

    /// /// /// /// /// PERMISSIONS HANDLER /// /// /// /// /// 

    client.on("ready", async () => {
        client.guilds.cache.forEach((g) => {
            g.commands.set(CommandsArray);
        });
    });
};