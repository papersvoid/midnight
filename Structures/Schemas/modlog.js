const { model, Schema } = require("mongoose");

module.exports = model("Modlogs", new Schema({
    GuildID: String,
    ChannelID: String,
    })
);