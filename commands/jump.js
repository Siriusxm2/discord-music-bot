const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("jump")
    .setDescription("Jump to a specific track.")
    .addNumberOption((option) =>
      option
        .setName("to")
        .setDescription("Track number")
        .setRequired(true)
        .setMinValue(1)
    ),

  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);

    if (!queue) return await interaction.followUp("There is no song playing.");

    const trackIndex = interaction.options.getNumber("to") - 1;
    const track = queue.tracks[trackIndex];
    queue.jump(trackIndex);

    await interaction.followUp({
      embeds: [
        new EmbedBuilder().setDescription(
          `Jumped to **[${track.title}](${track.url})**`
        ),
      ],
    });
  },
};
