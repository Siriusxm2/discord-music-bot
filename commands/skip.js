const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current song."),

  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);

    if (!queue) return await interaction.followUp("There is no song playing.");

    const currentSong = queue.current;
    queue.skip();

    await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setDescription(`Skipped **${currentSong.title}**`)
          .setThumbnail(currentSong.thumbnail),
      ],
    });
  },
};
