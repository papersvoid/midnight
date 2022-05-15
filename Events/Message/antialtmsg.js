const { MessageEmbed, GuildMember } = require("discord.js");
const ms = require("ms")
const DB = require("../../Structures/Schemas/AntiAlt"); // Change this to your own DB

module.exports = {
    name: 'guildMemberAdd', // This is the name of the Event
    /**
     * @param {GuildMember} member
     */
    async execute( member) {
        const Data = await DB.findOne({ // Checking for data in the DB
            GuildID: member.guild.id,
        });
        if (!Data) return; // If there is no data, we stop the event from running

        const logChannel = member.guild.channels.cache.get(Data.LogsChannel); // Get the logs channel

        let minAge = ms('20 days'); // Set the minimum age to 7 days
        let createdAt = new Date(member.user.createdAt).getTime() // Get the user's createdAt date
        let diff = Date.now() - createdAt // Get the difference between the current date and the user's createdAt date

        if (minAge > diff) { // If the difference is less than the minimum age
            member.kick() // Kick the user

            const logEmbed = new MessageEmbed()
                .setColor("BLURPLE")
                .setTitle("ALT FOUND!")
                .setDescription(`A user was kicked for being under 20 days old.\n\n**USER**: ${member.user.tag}\n**ID**: ${member.user.id}`)
                .setTimestamp()


            return await createAndDeleteWebhook(logEmbed) // Send the logs to the logs channel
        }

        async function createAndDeleteWebhook(embedName) {
            await logChannel.createWebhook(member.guild.name, { // Creates a webhook in the logging channel specified before
                avatar: member.guild.iconURL({
                    format: "png"
                })
            }).then(webhook => {
                webhook.send({ // Sends the embed through the webhook
                    embeds: [embedName]
                }).then(() => webhook.delete().catch(() => {})) // Deletes the webhook and catches the error if any
            });
        }
    }

}