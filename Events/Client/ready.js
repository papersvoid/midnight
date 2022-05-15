const { Client } = require("discord.js");
const mongoose = require("mongoose");
const { Database } = require("../../Structures/config.json");
const ms = require("ms");

const osUtils = require("os-utils");
const DB = require('../../Structures/Schemas/ClientDB');

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client 
     */
    execute(client) {
        console.log("🔥 The Client Is Now Ready!");
        client.user.setStatus("idle");
        client.user.setActivity(`/help & ;help | ${client.guilds.cache.size} Servers`, { type: "PLAYING" });

        if (!Database) return;
        mongoose.connect(Database, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log("🔒 The Client Is Now Connected To The DataBase!")
        }).catch((err) => {
            console.log(err)
        });


        // -------------- Events --------------//

// Memory Data Update
let memArray = [];

setInterval(async () => {
  //Used Memory in GB
  memArray.push((osUtils.totalmem() - osUtils.freemem()) / 1024);

  if (memArray.length >= 14) {
    memArray.shift();
  }

  // Store in Database
  await DB.findOneAndUpdate({
      Client: true,
    }, {
      Memory: memArray,
    }, {
      upsert: true,
    });
}, ms("5s")); //= 5000 (ms)


    }

}
