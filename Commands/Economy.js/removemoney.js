const { MessageEmbed } = require("discord.js");
const eco = require("../../Structures/Handlers/Economy")

module.exports = {
    name: "removemoney",
    description: "Removey money from a user",
    category: "Economy",
    permission: 'ADMINISTRATOR',
    options: [
        {
            name: "user",
            description: "Mention a user which you want to remove money from",
            type: "USER",
            required: true,
        },
        {
            name: "amount",
            description: "Give amount",
            type: "NUMBER",
            required: true,
        },
    ],
    execute: async (interaction, client, args) => {
        const { guild, options, member } = interaction;

        let target = options.getUser("user") || member
        let amount = options.getNumber("amount") || 1
        eco.balance.subtract(amount, target.id, guild.id)

        const embed = new MessageEmbed()
        .setTitle("Coins Succesfully Removed")
        .setDescription(`Removed ${amount} coins from ${target}`)
        .setColor("BLURPLE")

        interaction.reply({embeds: [embed]})
    }
}