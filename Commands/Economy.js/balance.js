const { MessageEmbed } = require("discord.js");
const eco = require("../../Structures/Handlers/Economy")

module.exports = {
    name: "balance",
    description: "Check user balance",
    userPermissions: ["SEND_MESSAGES"],
    category: "Economy",

    execute: async (interaction, client, args) => {
        const {
            member,
            guild
        } = interaction;

        let balance = eco.balance.fetch(member.id, guild.id)
        let bank = eco.bank.fetch(member.user.id, guild.id)

        if(!balance) balance = 0;
        if(!bank) bank = 0;

        const embed = new MessageEmbed()
        .setTitle(`**${member.user.username}**'s balance`)
        .setDescription(`
            Cash: **${balance}** coins.
            Bank: **${bank}** coins.
        `)
        .setColor("BLURPLE")

        interaction.reply({embeds: [embed]})
    }
}