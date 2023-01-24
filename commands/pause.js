const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the song being played."),

  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);

    if (!queue) return await interaction.followUp("There is no song playing.");

    queue.setPaused(true);

    await interaction.followUp("The song has been paused.");
  },
};
