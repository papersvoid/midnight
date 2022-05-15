const { MessageEmbed } = require("discord.js");
const eco = require("../../Structures/Handlers/Economy")

module.exports = {
    name: "setmoney",
    description: "Set user's money",
    category: "Economy",
    permission: 'ADMINISTRATOR',
    options: [
        {
            name: "user",
            description: "Mention a user which you want to give money to",
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
        eco.balance.set(amount, target.id, guild.id)

        const setEmbed = new MessageEmbed()
        .setTitle("Coins Succesfully Set")
        .setDescription(`Set **${target}'s** balance to ${amount} coins`)
        .setColor("BLURPLE")

        interaction.reply({embeds: [setEmbed]})
    }
} 