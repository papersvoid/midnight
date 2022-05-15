const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const DB = require("../../Structures/Schemas/PollDB");

module.exports = {
    name: "poll",
    description: "Create or manage a poll",
    permission: "MANAGE_GUILD",
    options: [
        {
            name: "create",
            description: "Create a poll",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "title",
                    description: "Give a name for the poll",
                    type: "STRING",
                    required: true
                },
                {
                    name: "choice1",
                    description: "What is the first choice for the poll",
                    type: "STRING",
                    required: true
                },
                {
                    name: "choice2",
                    description: "What is the second choice for the poll",
                    type: "STRING",
                    required: true
                },
                {
                    name: "choice3",
                    description: "What is the third choice for the poll",
                    type: "STRING"
                },
                {
                    name: "choice4",
                    description: "What is the fourth choice for the poll",
                    type: "STRING"
                },
                {
                    name: "choice5",
                    description: "What is the fifth choice for the poll",
                    type: "STRING"
                }
            ]
        },
        {
            name: "results",
            description: "Show the results of a poll",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "message_id",
                    description: "Provide the messageID of the poll",
                    type: "STRING",
                    required: true
                }
            ]
        }
    ],
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, guild, user } = interaction;
        const SubCommand = options.getSubcommand();

        switch (SubCommand) {
            case "create": {
                const Title = options.getString("title");
                const Choice1 = options.getString("choice1");
                const Choice2 = options.getString("choice2");
                const Choice3 = options.getString("choice3");
                const Choice4 = options.getString("choice4");
                const Choice5 = options.getString("choice5");

                let Choices = [`1️⃣ ${Choice1}`, `2️⃣ ${Choice2}`];
                const Row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId("poll-1")
                            .setStyle("SECONDARY")
                            .setLabel("1️⃣"),
                        new MessageButton()
                            .setCustomId("poll-2")
                            .setStyle("SECONDARY")
                            .setLabel("2️⃣")
                    )

                if (Choice3) {
                    Choices.push(`3️⃣ ${Choice3}`);
                    Row.addComponents(
                        new MessageButton()
                            .setCustomId("poll-3")
                            .setStyle("SECONDARY")
                            .setLabel("3️⃣")
                    )
                }
                if (Choice4) {
                    Choices.push(`4️⃣ ${Choice4}`);
                    Row.addComponents(
                        new MessageButton()
                            .setCustomId("poll-4")
                            .setStyle("SECONDARY")
                            .setLabel("4️⃣")
                    )
                }
                if (Choice5) {
                    Choices.push(`5️⃣ ${Choice5}`);
                    Row.addComponents(
                        new MessageButton()
                            .setCustomId("poll-5")
                            .setStyle("SECONDARY")
                            .setLabel("5️⃣")
                    )
                }

                const Embed = new MessageEmbed()
                    .setTitle(`${Title}`)
                    .setFooter({text: `Poll by ${user.tag}`})
                    .setColor("BLURPLE")
                    .setTimestamp()
                    .setDescription(Choices.join("\n\n"));

                const ErrorEmbed = new MessageEmbed()
                    .setColor("BLURPLE");

                try {
                    const M = await interaction.reply({embeds: [Embed], components: [Row], fetchReply: true});
                    await DB.create({
                        GuildID: guild.id,
                        ChannelID: interaction.channel.id,
                        MessageID: M.id,
                        CreatedBy: user.id,
                        Title: Title,
                        Button1: 0,
                        Button2: 0,
                        Button3: Choice3 ? 0 : null,
                        Button4: Choice4 ? 0 : null,
                        Button5: Choice5 ? 0 : null,
                    });
                } catch (err) {
                    ErrorEmbed
                        .setDescription(`<:denied:941879735200382986> There was an error while trying to create a poll`);
                    interaction.reply({embeds: [Embed], ephemeral: true});
                    console.log(err);
                }
            }
            break;

            case "results": {
                const MessageID = options.getString("message_id");
                const Data = await DB.findOne({ GuildID: guild.id, MessageID: MessageID });
                if (!Data) {
                    Embed
                        .setColor("BLURPLE")
                        .setDescription(`<:denied:941879735200382986> Could not find any poll with that messageID`);
                    return interaction.reply({embeds: [Embed], ephemeral: true});
                }
                const Embed = new MessageEmbed()
                    .setColor("BLURPLE")
                    .setAuthor({name: `${Data.Title}`})
                    .setFooter({text: `MessageID: ${MessageID}`})
                    .setTimestamp();
                
                let ButtonSize = [`1️⃣ - \`${Data.Button1}\` Users Selected`, `2️⃣ - \`${Data.Button2}\` Users Selected`];
                if (Data.Button3 !== null) ButtonSize.push(`3️⃣ - \`${Data.Button3}\` Users Selected`);
                if (Data.Button4 !== null) ButtonSize.push(`4️⃣ - \`${Data.Button4}\` Users Selected`);
                if (Data.Button5 !== null) ButtonSize.push(`5️⃣ - \`${Data.Button5}\` Users Selected`);

                Embed.setDescription(ButtonSize.join("\n\n"));
                interaction.reply({embeds: [Embed]});
            }
            break;
        }
    }
}