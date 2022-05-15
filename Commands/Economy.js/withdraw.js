const { MessageEmbed } = require("discord.js");
const eco = require("../../Structures/Handlers/Economy")

module.exports = {
    name: "withdraw",
    description: "Withdraw money from your bank",
    userPermissions: ["SEND_MESSAGES"],
    category: "Economy",
    options: [
        {
            name: "amount",
            description: "Give amount",
            type: "NUMBER",
            required: true,
        },
    ],
    execute: async (interaction, client, args) => {
        const { guild, options, member } = interaction;

        let amount = options.getNumber("amount")
        let balance = eco.bank.fetch(member.id, guild.id)

        if(!amount) return interaction.reply('Specify an amount.')
        if(isNaN(amount)) return interaction.reply('Amount must be a number.')
        if(amount > balance) return interaction.reply(`You don't have enough money in your bank to send **${amount}** coins on your balance.`)

        eco.balance.add(amount, member.id, guild.id)
        eco.bank.subtract(amount, member.id, guild.id)

        const embed = new MessageEmbed()
        .setTitle("Money to Bank")
        .setDescription(`Successfully sent **${amount}** to your balance!`)
        .setColor("BLURPLE")

        interaction.reply({embeds: [embed]})
    }
}