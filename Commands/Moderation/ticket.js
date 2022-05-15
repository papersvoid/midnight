const { MessageEmbed, CommandInteraction, ButtonInteraction } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
const DB = require("../../Structures/Schemas/TicketDB");
const TicketSetupData = require("../../Structures/Schemas/TicketSetup");


module.exports = {
    name: "ticket",
    description: "Ticket Actions",
    options: [
        {
            name: "user",
            description: "Add or remove a user from the ticket",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "action",
                    type: "STRING",
                    description: "Add or remove a member from this ticket",
                    required: true,
                    choices: [
                        {name: "Add", value: "add"},
                        {name: "Remove", value: "remove"},
                    ]
                },
                {
                    name: "member",
                    description: "Select a member",
                    type: "USER",
                    required: true,
                },
            ]
        },
        {
            name: "close",
            description: "Close the ticket",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "reason",
                    description: "Provide a reason",
                    type: "STRING",
                    required: true
                }
            ]
        },
        {
            name: "lock",
            description: "Lock this ticket channel for reviewing",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "reason",
                    description: "Provide a reason",
                    type: "STRING"
                }
            ]
        },
        {
            name: "unlock",
            description: "Unlock this ticket",
            type: "SUB_COMMAND",
        },
        {
            name: "claim",
            description: "Claim this ticket for yourself",
            type: "SUB_COMMAND"
        }
    ],
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { guildId, options, channel, guild, member } = interaction;
        const Embed = new MessageEmbed();
        const SubCommand = options.getSubcommand();
        await interaction.deferReply();
        
        const TicketSetup = await TicketSetupData.findOne({ GuildID: guild.id });
        if (!TicketSetup) {
            Embed
                .setColor("BLURPLE")
                .setDescription(`<:rejected:94189735200382986> There is no data in the database`);
            return interaction.editReply({embeds: [Embed], ephemeral: true});
        }

        if (!member.roles.cache.find(r => r.id === TicketSetup.Handlers) || !member.permissions.has("ADMINISTRATOR")) {
            Embed
                .setColor("BLURPLE")
                .setDescription(`<:rejected:941879735200382986> This command is for staff only!`);
            return interaction.editReply({embeds: [Embed], ephemeral: true});
        }

        switch (SubCommand) {
            case "user": {
                const Action = options.getString("action");
                const Member = options.getMember("member");

                switch (Action) {
                    case "add": 
                        DB.findOne({GuildID: guildId, ChannelID: channel.id}, async (err, docs) => {
                            if (err) throw err;
                            if (!docs) {
                                Embed
                                    .setColor("BLURPLE")
                                    .setDescription(`<:rejected:941879735200382986> This channel is not a ticket channel`);
                                return interaction.editReply({embeds: [Embed], ephemeral: true});
                            }
                            
                            if (docs.MembersID.includes(Member.id)) {
                                Embed
                                    .setColor("BLURPLE")
                                    .setDescription(`<:rejected:941879735200382986> This user is already in the ticket`);
                                return interaction.editReply({embeds: [Embed]});
                            }
        
                            docs.MembersID.push(Member.id);
        
                            channel.permissionOverwrites.edit(Member.id, {
                                SEND_MESSAGES: true,
                                VIEW_CHANNEL: true,
                                READ_MESSAGE_HISTORY: true
                            });
        
                            interaction.editReply({
                                embeds: [
                                    Embed.setColor("BLURPLE").setDescription(
                                        `<:approved:941879734768398337> ${Member} has been added to the ticket`
                                    )
                                ]
                            });
                            docs.save();
                        }
                    );
                    break;
                    case "remove": 
                        DB.findOne({GuildID: guildId, ChannelID: channel.id}, async (err, docs) => {
                            if (err) throw err;
                            if (!docs) {
                                Embed
                                    .setColor("BLURPLE")
                                    .setDescription(`<:rejected:941879735200382986> This channel is not a ticket channel`);
                                return interaction.editReply({embeds: [Embed], ephemeral: true});
                            }
                            if (!docs.MembersID.includes(Member.id)) {
                                Embed
                                    .setColor("BLURPLE")
                                    .setDescription(`<:rejected:941879735200382986> This user is not in the ticket`);
                                return interaction.editReply({embeds: [Embed], ephemeral: true});
                            }
        
                            docs.MembersID.remove(Member.id);
        
                            channel.permissionOverwrites.edit(Member.id, {
                                SEND_MESSAGES: false,
                            });
        
                            interaction.editReply({
                                embeds: [
                                    Embed.setColor("BLURPLE").setDescription(
                                        `<:approved:941879734768398337> ${Member} has been removed from this ticket`
                                    )
                                ]
                            })
                            docs.save();
                        }
                    );
                    break;
                }
            }
            break;

            case "close": {
                const Reason = options.getString("reason");
                DB.findOne({ChannelID: channel.id}, async (err, data) => {
                    if (err) throw err;
                    if (!data) {
                        Embed
                            .setColor("BLURPLE")
                            .setDescription(`<:rejected:941879735200382986> There is no data in the database. Please delete this ticket manually`);
                        return interaction.editReply({embeds: [Embed], ephemeral: true});
                    }

                    if (data.Closed === true) {
                        Embed
                            .setColor("BLURPLE")
                            .setDescription(`<:rejected:941879735200382986> This ticket is already closed. Please wait for it to be deleted`);
                        return interaction.editReply({embeds: [Embed], ephemeral: true});
                    }

                    const attachment = await createTranscript(channel, {
                        limit: -1,
                        returnBuffer: false,
                        fileName: `${data.CreatedBy} - ${data.TicketID}.html`,
                    });
                    await DB.updateOne({
                        ChannelID: channel.id,
                    }, {
                        Closed: true,
                    });

                    try {
                        Embed
                            .setTitle(`Ticket ID: ${data.TicketID}`)
                            .setDescription(`Closed By: ${member.user.tag}\nReason: **${Reason}**\nMember: <@${data.CreatedBy}>`)
                            .setThumbnail(`${interaction.guild.iconURL({dynamic: true})}`)
                            .setTimestamp();
                        
                        const Message = await guild.channels.cache.get(TicketSetup.Transcripts).send({
                            embeds: [Embed],
                            files: [attachment],
                        });

                        interaction.editReply({embeds: [Embed]});
                        setTimeout(() => {
                            channel.delete().catch(() => {});
                        }, 5 * 1000)
                    } catch (err) {};
                })
            }
            break;
            case "lock": {
                const Reason = options.getString("reason") || "No reason provided";
                DB.findOne({ChannelID: channel.id}, async (err, data) => {
                    if (err) throw err;
                    if (!data) {
                        Embed
                            .setColor("BLURPLE")
                            .setDescription(`<:rejected:941879735200382986> There is no data in the database`);
                        return interaction.editReply({embeds: [Embed]});
                    }

                    if (data.Locked === true) {
                        Embed
                            .setColor("BLURPLE")
                            .setDescription(`<:rejected:941879735200382986> This ticket is already locked`);
                        return interaction.editReply({embeds: [Embed]});
                    }
                    await DB.updateOne({
                        ChannelID: channel.id
                    }, {
                        Locked: true
                    });
                    Embed.setDescription(`<:approved:941879734768398337> This ticket is now locked for reviewing`).setColor("BLURPLE");
                    data.MembersID.forEach(m => {
                        channel.permissionOverwrites.edit(m, {
                            SEND_MESSAGES: false,
                        });
                    });
                    interaction.editReply({embeds: [Embed]});
                });
            }
            break;
            case "unlock": {
                DB.findOne({ChannelID: channel.id}, async (err, data) => {
                    if (err) throw err;
                    if (!data) {
                        Embed
                            .setColor("BLURPLE")
                            .setDescription(`<:rejected:941879735200382986> There is no data in the database`);
                        return interaction.editReply({embeds: [Embed]});
                    }
                    if (data.Locked === false) {
                        Embed
                            .setColor("BLURPLE")
                            .setDescription(`<:rejected:941879735200382986> This ticket is already unlocked!`);
                        return interaction.editReply({embeds: [Embed]});
                    }
                    await DB.updateOne({ ChannelID: channel.id}, { Locked: false });
                    data.MembersID.forEach((m) => {
                        channel.permissionOverwrites.edit(m, {
                            SEND_MESSAGES: false,
                        });
                    });
                    Embed.setDescription(`<:approved:941879734768398337> This ticket has been unlocked`).setColor("BLURPLE");
                    interaction.editReply({embeds: [Embed]});
                })
            }
            break;
            case "claim": {
                DB.findOne({ChannelID: channel.id}, async (err, data) => {
                    if (err) throw err;
                    if (!data) {
                        Embed
                            .setColor("BLURPLE")
                            .setDescription(`<:rejected:941879735200382986> There is no data in the database`);
                        return interaction.editReply({embeds: [Embed]});
                    }
                    if (data.Claimed === true) {
                        Embed
                            .setColor("BLURPLE")
                            .setDescription(`<:rejected:941879735200382986> This ticket has already been claimed by <@${data.ClaimedBy}>`);
                        return interaction.editReply({embeds: [Embed]});
                    }

                    await DB.updateOne({ChannelID: channel.id}, {Claimed: true, ClaimedBy: member.id});

                    Embed.setDescription(`This ticket has been claimed by ${member}`).setColor("BLURPLE");
                    interaction.editReply({
                        embeds: [Embed],
                    });
                });
            }
            break;
        }
    }
}