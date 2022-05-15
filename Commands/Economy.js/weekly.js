const { MessageEmbed } = require("discord.js");
const eco = require("../../Structures/Handlers/Economy");

module.exports = {
    name: "weekly",
    description: "Claim weekly rewards",
    userPermissions: ["SEND_MESSAGES"],
    category: "Economy",

    execute: async (interaction, client, args) => {
        const { member, guild } = interaction;

        let weekly = eco.rewards.weekly(member.id, guild.id);
        if(!weekly.status){
            const claimedEmbed = new MessageEmbed()
            .setDescription(`You have already claimed your weekly reward! Time left until next claim: **${weekly.value.days}** days, **${weekly.value.hours}** hours, **${weekly.value.minutes}** minutes and **${weekly.value.seconds}** seconds.`)
            .setColor("GREEN")

            return interaction.reply({embeds: [claimedEmbed]});
        }
        const receiveEmbed = new MessageEmbed()
        .setTitle("Daily Rewards")
        .setDescription(`You have received **${weekly.reward}** weekly coins!`)
        .setColor("BLURPLE")

        interaction.reply({embeds: [receiveEmbed]});
    }
}