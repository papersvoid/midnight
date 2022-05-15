/**
 * Author: Guglieeee
 * Github: https://github.com/Guglieee
 * Created On: 22nd April 2022
 */
 const { model, Schema } = require("mongoose");

 module.exports = model(
   "FeedBack",
   new Schema({
     GuildID: String,
     MemberID: String,
     Stars: String,
     FeedBack: String,
   })
 );
 