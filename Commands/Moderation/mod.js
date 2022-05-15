const { CommandInteraction, MessageEmbed, Client, GuildMember } = require("discord.js");
const DB = require("../../Structures/Schemas/Modlog");


module.exports = {
    name: "mod",
    description: "Warn, kick and ban commands in one for moderators",
    options: [
        {
            name: "member",
            description: "Select the member you want to warn, kick or ban",
            type: "USER",
            required: true,
        },
        {
            name: "actions",
            description: "Select an action",
            type: "STRING",
            required: true,
            choices: [
                { name: "warning", value: "warning" },
                { name: "kick", value: "kick" },
                { name: "ban", value: "ban" },                
            ]
        },
        {
            name: "reason",
            description: "Provide a reason",
            type: "STRING",
            required: true,
        },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, member, guild, channel } = interaction;

        const Data = await DB.findOne({ GuildID: guild.id });
        if (!Data) return interaction.reply({ content: "You havn't setup a mod message log yet, Please do this with [/modlogsetup]", ephemeral: true });

        const channellog = Data.ChannelID

        const user = options.getMember("member");
        const reason = options.getString("reason");
        const id = await interaction.guild.members.fetch(user.id);

        if(!id)
        return interaction.reply({ content: "Possible member already left on there own or something els went wrong", ephemeral: true })

        switch(options.getString("actions")) {
            case "warning" : {
                if(!interaction.member.permissions.has("MANAGE_MESSAGES"))
                return interaction.reply({ content: "You do not have the right permissions to use this action", ephemeral: true });

                if(interaction.member.roles.highest.position <= id.roles.highest.position)
                return interaction.reply({ content: "You can't use this action on this member, this member is equal to your rank or higher", ephemeral: true })

                const warn = new MessageEmbed()
                    .setTitle("Succesfully warned the member")
                    .setColor("BLURPLE")
                    .setThumbnail(id.user.avatarURL({ dynamic: true }))
                    .setFields(
                        { name: "ID", value: id.id },
                        { name: "Warn Reason", value: reason },
                        { name: "Joined Server", value: `<t:${parseInt(id.joinedTimestamp / 1000)}:R>`, inline: true },
                        { name: "Account Created", value: `<t:${parseInt(id.user.createdTimestamp / 1000)}:R>`, inline: true }
                    );
                await id.send({ embeds: [new MessageEmbed()
                    .setTitle("**Warning**")
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({Dynamic: true, size: 512}) })
                    .setColor("BLURPLE")
                    .setThumbnail(`${guild.iconURL({dynamic: true, size: 512})}`)
                    .setFields(
                        { name: "Warned by", value: interaction.user.tag },
                        { name: "Reason", value: reason },
                        { name: "Discord Server", value: guild.name },
                )] })
                .catch(()=>{console.log("⛔ Private message blocked by the user")});
                await interaction.reply({ embeds: [warn], ephemeral: true });
                await guild.channels.cache.get(`${channellog}`).send({ embeds: [warn] });
            }
            break;

            case "kick" : {
                if(!interaction.member.permissions.has("KICK_MEMBERS"))
                return interaction.reply({ content: "You do not have the right permissions to use this action", ephemeral: true });

                if(interaction.member.roles.highest.position <= id.roles.highest.position)
                return interaction.reply({ content: "You can't use this action on this member, this member is equal to your rank or higher", ephemeral: true })

                const kick = new MessageEmbed()
                    .setTitle("Succesfully kicked the member")
                    .setColor("BLURPLE")
                    .setThumbnail(id.user.avatarURL({ dynamic: true }))
                    .setFields(
                        { name: "ID", value: id.id },
                        { name: "Kick Reason", value: reason },
                        { name: "Joined Server", value: `<t:${parseInt(id.joinedTimestamp / 1000)}:R>`, inline: true },
                        { name: "Account Created", value: `<t:${parseInt(id.user.createdTimestamp / 1000)}:R>`, inline: true },
                    );
                await id.send({ embeds: [new MessageEmbed()
                    .setTitle("**Kicked**")
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({Dynamic: true, size: 512}) })
                    .setColor("BLURPLE")
                    .setThumbnail(`${guild.iconURL({dynamic: true, size: 512})}`)
                    .setFields(
                        { name: "Kicked by", value: interaction.user.tag },
                        { name: "Reason", value: reason },
                        { name: "Discord Server", value: guild.name },
                )] })
                .catch(()=>{console.log("⛔ Private message blocked by the user")});
                await interaction.reply({ embeds: [kick], ephemeral: true });
                await id.kick({ reason: reason });
                await guild.channels.cache.get(`${channellog}`).send({ embeds: [kick] });
            }
            break;

            case "ban" : {
                if(!interaction.member.permissions.has("BAN_MEMBERS"))
                return interaction.reply({ content: "You do not have the right permissions to use this action", ephemeral: true });

                if(interaction.member.roles.highest.position <= id.roles.highest.position)
                return interaction.reply({ content: "You can't use this action on this member, this member is equal to your rank or higher", ephemeral: true })
                
                const ban = new MessageEmbed()
                    .setTitle("Succesfully banned the member")
                    .setColor("BLURPLE")
                    .setThumbnail(id.user.avatarURL({ dynamic: true }))
                    .setFields(
                        { name: "ID", value: id.id },
                        { name: "Ban Reason", value: reason },
                        { name: "Joined Server", value: `<t:${parseInt(id.joinedTimestamp / 1000)}:R>`, inline: true },
                        { name: "Account Created", value: `<t:${parseInt(id.user.createdTimestamp / 1000)}:R>`, inline: true },
                    );
                await id.send({ embeds: [new MessageEmbed()
                    .setTitle("**Banned**")
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({Dynamic: true, size: 512}) })
                    .setColor("BLURPLE")
                    .setThumbnail(`${guild.iconURL({dynamic: true, size: 512})}`)
                    .setFields(
                        { name: "Banned by", value: interaction.user.tag },
                        { name: "Reason", value: reason },
                        { name: "Discord Server", value: guild.name },
                )] })
                .catch(()=>{console.log("⛔ Private message blocked by the user")});
                await interaction.reply({ embeds: [ban], ephemeral: true });
                await id.ban({ days: 0, reason: reason});
                await guild.channels.cache.get(`${channellog}`).send({ embeds: [ban] });
            }
            break;
        }
    } 
}