/**
 * Author: Amit Kumar
 * Github: https://github.com/AmitKumarHQ
 * Created On: 27th March 2022
 */

 const { GuildMember, MessageEmbed } = require("discord.js");
 const { drawCard, Text } = require('discord-welcome-card');
 const DB = require("../../Structures/Schemas/CardSystemDB");
 

 
 module.exports = {
     name: "guildMemberRemove",
 
     /**
      * 
      * @param {GuildMember} member 
      */
     async execute(member) {
         const { guild } = member;
 
         if(member.user.bot) return;
 
         // Database
         const db = await DB.findOne({
             GuildID: guild.id
         });
 
         if(db) {
             const title = db.LeaveTitle || 'Bye!';
             const desc = db.LeaveDesc || member.user.username;
             const channel = db.LeaveChannel;
     
             const image = await drawCard({
                 theme: "dark",
                 blur: false,
                 rounded: true,
                 text: {
                     title: new Text(title, 250, 100)
                         .setFontSize(35)
                         .setStyle(`#03B0CC`),
                     text: new Text(desc, 250, 170)
                         .setFontSize(55),
                     color: `#DDDDDD`,
                     font: 'Cousine',
                 },
                 avatar: {
                     image: member.user.avatarURL({
                         dynamic: true,
                         format: 'png',
                         size: 2048,
                     }),
                     borderRadius: 1, // Corner radius of the avatar (0.5 = 50% rounded)
                     imageRadius: 0.75, // Size of the avatar (0.85 = 85%)
                     outlineWidth: 10,
                     outlineColor: "#00B1CD",
                 },
                 background: "blank/bg.png",
             });
     
             const embed = new MessageEmbed()
             .setColor(`#FF5555`)
             .setAuthor({
                 name: `USER LEFT`,
                 iconURL: member.user.displayAvatarURL({
                     dynamic: true,
                     format: 'png',
                 })
             })
             .setDescription(`Goodbye, hope to see you again!`)
             .setImage(`blank/bg.png`)
             .setThumbnail(member.user.displayAvatarURL({
                 dynamic: true,
                 format: 'png',
             }))
     
             if(channel) {
                 member.guild.channels.cache.get(channel)
                 .send({
                     // embeds: [embed],
                     files: [{
                         attachment: image
                     }]
                 });
             } else if (!channel) {
                 member.guild.systemChannel
                 .send({
                     // embeds: [embed],
                     files: [{
                         attachment: image
                     }]
                 });
             }
         } else if(!db) {
             const title = 'Bye!';
             const desc = member.user.username;
             const channel = member.guild.systemChannelId;
     
             const image = await drawCard({
                 theme: "dark",
                 blur: false,
                 rounded: true,
                 text: {
                     title: new Text(title, 250, 100)
                         .setFontSize(35)
                         .setStyle(`#03B0CC`),
                     text: new Text(desc, 250, 170)
                         .setFontSize(55),
                     color: `#DDDDDD`,
                     font: 'Cousine',
                 },
                 avatar: {
                     image: member.user.avatarURL({
                         dynamic: true,
                         format: 'png',
                         size: 2048,
                     }),
                     borderRadius: 1, // Corner radius of the avatar (0.5 = 50% rounded)
                     imageRadius: 0.75, // Size of the avatar (0.85 = 85%)
                     outlineWidth: 10,
                     outlineColor: "#00B1CD",
                 },
                 background: "blank/bg.png",
             });
     
             const embed = new MessageEmbed()
             .setColor(`#FF5555`)
             .setAuthor({
                 name: `USER LEFT`,
                 iconURL: member.user.displayAvatarURL({
                     dynamic: true,
                     format: 'png',
                 })
             })
             .setDescription(`Goodbye, hope to see you again!`)
             .setImage(`blank/bg.png`)
             .setThumbnail(member.user.displayAvatarURL({
                 dynamic: true,
                 format: 'png',
             }))
     
             member.guild.channels.cache.get(channel)
             .send({
                 // embeds: [embed],
                 files: [{
                     attachment: image
                 }]
             });
         }
     }
 }