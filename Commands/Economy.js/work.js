const { MessageEmbed } = require("discord.js");
const eco = require("../../Structures/Handlers/Economy");

module.exports = {
    name: "work",
    description: "Get your work rewards",
    userPermissions: ["SEND_MESSAGES"],
    category: "Economy",

    execute: async (interaction, client, args) => {
        const { member, guild } = interaction;

        let work = eco.rewards.work(member.id, guild.id);
        if(!work.status){
            
            const claimedEmbed = new MessageEmbed()
            .setDescription(`You have already worked! Time left until next work: **${work.value.days}** days, **${work.value.hours}** hours, **${work.value.minutes}** minutes and **${work.value.seconds}** seconds.`)
            .setColor("GREBLURPLEEN")

            return interaction.reply({embeds: [claimedEmbed]});
        }
        const receiveEmbed = new MessageEmbed()
        .setTitle("Work Rewards")
        .setDescription(`You worked hard and earned **${work.pretty}** coins!`)
        .setColor("GRBLURPLEEEN")

        interaction.reply({embeds: [receiveEmbed]});       
    }
}