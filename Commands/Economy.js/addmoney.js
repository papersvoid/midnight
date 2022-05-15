const { MessageEmbed } = require("discord.js");
const eco = require("../../Structures/Handlers/Economy")

module.exports = {
    name: "addmoney",
    description: "Add money to a user",
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
        eco.balance.add(amount, target.id, guild.id)

        const embed = new MessageEmbed()
        .setTitle("Coins Succesfully added")
        .setDescription(`Amount: ${amount} coins`)
        .setColor("BLURPLE")

        interaction.reply({embeds: [embed]})
    }
}