const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const DB = require("../../Structures/Schemas/TicketSetup");

module.exports = {
    name: "ticket-setup",
    description: "Setup your ticket system",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "channel", 
            description: "Select a ticket creation channel", 
            required: true, 
            type: "CHANNEL", 
            channelTypes: ["GUILD_TEXT"]
        },
        {
            name: "category", 
            description: "Select the ticket channels parent category", 
            required: true, 
            type: "CHANNEL", 
            channelTypes: ["GUILD_CATEGORY"]
        },
        {
            name: "transcripts", 
            description: "Select a ticket transcripts channel", 
            required: true, 
            type: "CHANNEL", 
            channelTypes: ["GUILD_TEXT"]
        },
        {
            name: "helpers", 
            description: "Select the ticket helpers role",
            required: true, 
            type: "ROLE",
        },
        {
            name: "description", 
            description: "Set a description of the ticket system",
            required: true, 
            type: "STRING",
        },
        {
            name: "first-button", 
            description: "Select a name for your first button", 
            required: true, 
            type: "STRING", 
        },
        {
            name: "second-button", 
            description: "Select a name for your second button", 
            type: "STRING", 
        },
        {
            name: "third-button", 
            description: "Select a name for your third button", 
            type: "STRING", 
        },
        {
            name: "fourth-button",
            description: "Select a name for your fourth button",
            type: "STRING"
        },
        {
            name: "fifth-button",
            description: "Select a name for your fifth button",
            type: "STRING"
        }
    ],
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { guild, options } = interaction;

        try {
            const Channel = options.getChannel("channel");
            const Category = options.getChannel("category");
            const Transcripts = options.getChannel("transcripts");

            const Handlers = options.getRole("helpers");
            const Everyone = guild.roles.everyone;
            const Description = options.getString("description");

            const Button1 = options.getString("first-button");
            const Button2 = options.getString("second-button");
            const Button3 = options.getString("third-button");
            const Button4 = options.getString("fourth-button");
            const Button5 = options.getString("fifth-button");

            await DB.findOneAndUpdate(
                {GuildID: guild.id},
                {
                    ChannelID: Channel.id,
                    Category: Category.id,
                    Transcripts: Transcripts.id,
                    Handlers: Handlers.id,
                    Everyone: Everyone.id,
                    Description: Description,
                    IDs: 0
                },
                {
                    new: true,
                    upsert: true,
                }
            )

                const Buttons = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId("Ticket-1")
                        .setLabel(Button1)
                        .setStyle("SECONDARY"),
                );
                if (Button2) {
                    Buttons.addComponents(
                        new MessageButton()
                        .setCustomId("Ticket-2")
                        .setLabel(Button2)
                        .setStyle("SECONDARY"),
                    )
                }
                if (Button3) {
                    Buttons.addComponents(
                        new MessageButton()
                        .setCustomId("Ticket-3")
                        .setLabel(Button3)
                        .setStyle("SECONDARY"),
                    )
                }
                if (Button4) {
                    Buttons.addComponents(
                        new MessageButton()
                        .setCustomId("Ticket-4")
                        .setLabel(Button4)
                        .setStyle("SECONDARY"),
                    )
                }
                if (Button5) {
                    Buttons.addComponents(
                        new MessageButton()
                        .setCustomId("Ticket-5")
                        .setLabel(Button5)
                        .setStyle("SECONDARY"),
                    )
                }

                const Embed = new MessageEmbed()
                    .setAuthor({name: `${guild.name} | Ticket System`, iconURL: `${guild.iconURL({dynamic: true})}`})
                    .setDescription(Description)
                    .setColor("BLURPLE");
            
                guild.channels.cache.get(Channel.id).send({embeds: [Embed], components: [Buttons]});
                interaction.reply({content: `Done`, ephemeral: true});

        } catch (err) {
            const ErrorEmbed = new MessageEmbed()
                .setColor("BLURPLE")
                .setDescription(
                    `❌ | An error ocurred while up your ticket system\n**What should I make sure of?**
                    1. Make sure none of your buttons' names are duplicated.
                    2. Make sure your button names do not exceed 200 characters
                    `
                );
            interaction.reply({embeds: [ErrorEmbed]});
            console.error(err);
        }
    }
}