const { CommandInteraction, MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "animal",
    description: "Gives you a picture of a animal.",
    options: [
        {
        name: "name",
        description: "Name of the animal",
        type: "STRING",
        required: true
        }
    ],

    /**
     * 
     * @param { MessageEmbed } message
     * @param { CommandInteraction } interaction
     */
    async execute(interaction) {
        const { options } = interaction;

        const animalName = options.getString("name")

        let url = `https://some-random-api.ml/img/${animalName}/`;

        let data, response;

        try{
            response = await axios.get(url);
            data = response.data;
            const animals = new MessageEmbed()
            .setColor("BLURPLE")
            .setTitle(`Random ${animalName}`)
            .setImage(data.link)
            await interaction.reply({ embeds: [animals]}) //.then(msg => { setTimeout(() => msg.delete(), 10000) })

        }catch (e) {
            return interaction.reply({ content: `An error occured, please try again!`, ephemeral: true });
            
    }

}}