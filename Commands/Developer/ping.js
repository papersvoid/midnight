const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Totally Pings the bot.",
    permission: "ADMINSTRATOR",
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    execute(interaction) {
        new MessageEmbed()
        interaction.reply({content: "Poing"})
    }
}