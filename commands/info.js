const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Shows the current song."),

  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);

    if (!queue) return await interaction.followUp("There is no song playing.");

    const progressBar = queue.createProgressBar({
      queue: false,
      timecodes: true,
    });

    const perc = queue.getPlayerTimestamp();

    const currentSong = queue.current;

    await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setTitle(`**Now Playing**`)
          .setDescription(`**[${currentSong.title}](${currentSong.url})**\n`)
          .setThumbnail(currentSong.thumbnail)
          .addFields(
            {
              name: "Requested By",
              value: `<@${currentSong.requestedBy.id}>`,
            },
            {
              name: "Progress Bar",
              value: progressBar,
            }
          ),
      ],
    });
  },
};
