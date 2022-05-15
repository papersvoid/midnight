/**
 * Author: Guglieeee
 * Github: https://github.com/Guglieee
 * Created On: 22nd April 2022
 */

 const {
    CommandInteraction,
    MessageEmbed,
    WebhookClient,
  } = require("discord.js");
  const DB = require("../../Structures/Schemas/FeedbackDB");
  
  module.exports = {
    name: "feedback",
    description: "Give us feedback",
    options: [
      {
        name: "stars",
        description: "Rate the server",
        type: "STRING",
        required: true,
        choices: [
          { name: "⭐", value: "1" },
          { name: "⭐⭐", value: "2" },
          { name: "⭐⭐⭐", value: "3" },
          { name: "⭐⭐⭐⭐", value: "4" },
          { name: "⭐⭐⭐⭐⭐", value: "5" },
        ],
      },
      {
        name: "feed",
        description: "Describe your feedback",
        type: "STRING",
        required: true,
      },
    ],
    /**
     *
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
      const { options, guildId, member, user, channel } = interaction;
      const feedbackchannel = new WebhookClient({
        url: "https://discord.com/api/webhooks/972639151105142875/0RV5Xz1U3as3KxoOngiZOgeq_AB7rEnXbk8VE7cxmMiJScLcngRrfEJ4m0HH9HMG7AnK", // Webhook where the feedback will go
      });
      const feedbacklog = new WebhookClient({
        url: "https://discord.com/api/webhooks/972639151105142875/0RV5Xz1U3as3KxoOngiZOgeq_AB7rEnXbk8VE7cxmMiJScLcngRrfEJ4m0HH9HMG7AnK", // Webhook of the log channel
      });
      const stars = options.getString("stars");
      const description = options.getString("feed");
      interaction.reply({
        content: "Thanks you for the feedback! We will defenitly look at it and see what we can do!",
        ephemeral: true,
      });
      DB.create({
        GuildID: guildId,
        MemberID: member.id,
        Stars: stars,
        FeedBack: description,
      });
      const embedfeedBack = new MessageEmbed()
        .setAuthor(
          member.user.tag,
          member.user.displayAvatarURL({ dynamic: true })
        )
        .setTitle("Nuovo FeedBack")
        .setDescription(
          `**Stars**:\n\`\`\`${switchTo(
            stars
          )}\`\`\`\n**Feedback**:\n${description}`
        )
        .setColor("BLURPLE")
        .setTimestamp();
      feedbackchannel.send({ embeds: [embedfeedBack] });
      const embedlog = new MessageEmbed()
        .setAuthor(
          member.user.tag,
          member.user.displayAvatarURL({ dynamic: true })
        )
        .setTitle("New feedback Log")
        .setDescription(
          `**Stars**:\n\`\`\`${switchTo(
            stars
          )}\`\`\`\n**Feedback**:\n${description}\n**User + id**:\`\`\`${
            member.user.tag
          } | ${member.id}\`\`\``
        )
        .setTimestamp();
      feedbacklog.send({ embeds: [embedlog] });
    },
  };
  function switchTo(val) {
    var stelle = " ";
    switch (val) {
      case "1":
        stelle = "⭐";
        break;
      case "2":
        stelle = "⭐⭐";
        break;
      case "3":
        stelle = "⭐⭐⭐";
        break;
      case "4":
        stelle = "⭐⭐⭐⭐";
        break;
      case "5":
        stelle = "⭐⭐⭐⭐⭐";
        break;
    }
    return stelle;
  }
  