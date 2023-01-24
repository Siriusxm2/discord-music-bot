const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Shuffle the queue."),

  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);

    if (!queue) return await interaction.followUp("There is no song playing.");

    queue.shuffle();

    await interaction.followUp("Queue has been shuffled.");
  },
};
