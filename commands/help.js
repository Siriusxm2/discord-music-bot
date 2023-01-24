const { SlashCommandBuilder } = require("@discordjs/builders");
const { embed } = require("../welcome");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show the commands."),

  execute: async ({ client, interaction }) => {
    await interaction.followUp({ embeds: [embed] });
  },
};
