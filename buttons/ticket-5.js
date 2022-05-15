const { ButtonInteraction, MessageEmbed, MessageActionRow, MessageButton } = require(`discord.js`);
const DB = require("../../bot/Structures/Schemas/TicketDB");
const TicketSetupData = require("../../bot/Structures/Schemas/TicketSetup");

module.exports = {
    id: `Ticket-5`,
    /**
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction) {
        const { guild, member, customId } = interaction;
        const Data = await TicketSetupData.findOne({GuildID: guild.id});
        if (!Data) return;

        const ID = Data.IDs + 1;
        await guild.channels.create(`${member.user.tag}`, {
            type: "GUILD_TEXT",
            parent: Data.Category,
            permissionOverwrites: [
                {
                    id: member.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                },
                {
                    id: Data.Handlers,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "READ_MESSAGE_HISTORY"]
                },
                {
                    id: guild.roles.everyone.id,
                    deny: ["VIEW_CHANNEL"],
                },
            ],
        }).then(async channel => {
            await DB.create({
                GuildID: guild.id,
                MembersID: member.id,
                TicketID: ID,
                ChannelID: channel.id,
                Closed: false,
                Locked: false,
                Type: customId,
                Claimed: false,
                CreatedBy: member.id,
                Opened: parseInt(Date.now() / 1000)
            });
            channel.setRateLimitPerUser(5);
            await TicketSetupData.findOneAndUpdate({GuildID: guild.id}, {IDs: ID});
            const Embed = new MessageEmbed()
                .setAuthor({name: `${guild.name} | Ticket ID: ${ID}`, iconURL: `${guild.iconURL({dynamic: true})}`})
                .setDescription(`Ticket Created by <@${interaction.user.id}>\n\nPlease wait patiently for a response from the Staff team, in the meanwhile, please describe your issue or report in as much detail as possible.`);
            channel.send({
                embeds: [Embed],
                content: `<@${interaction.user.id}>`
            });

            await interaction.reply({content: `${member} your ticket has been created: ${channel}`, ephemeral: true});
        });
    }
}