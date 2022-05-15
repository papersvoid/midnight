const { MessageEmbed } = require("discord.js");
const eco = require("../../Structures/Handlers/Economy");

module.exports = {
    name: "daily",
    description: "Claim daily rewards",
    userPermissions: ["SEND_MESSAGES"],
    category: "Economy",

    execute: async (interaction, client, args) => {
        const { member, guild } = interaction;

        let daily = eco.rewards.daily(member.id, guild.id);
        if(!daily.status){
            const claimedEmbed = new MessageEmbed()
            .setDescription(`You have already claimed your daily reward! Time left until next claim: **${daily.value.days}** days, **${daily.value.hours}** hours, **${daily.value.minutes}** minutes and **${daily.value.seconds}** seconds.`)
            .setColor("GREEN")

            return interaction.reply({embeds: [claimedEmbed]});
        }
        const receiveEmbed = new MessageEmbed()
        .setTitle("Daily Rewards")
        .setDescription(`You have received **${daily.reward}** daily coins!`)
        .setColor("BLURPLE")

        interaction.reply({embeds: [receiveEmbed]});
    }
}