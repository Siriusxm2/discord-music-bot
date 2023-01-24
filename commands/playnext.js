const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playnext")
    .setDescription("Adds a song to the top of the queue.")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("The song you want to play next")
        .setRequired(true)
    ),

  execute: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);

    if (!queue) return await interaction.followUp("There is no song playing.");

    let url = interaction.options.getString("url");
    const result = await client.player
      .search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      })
      .catch((err) => {
        console.log(err);
      });

    if (!result) return await interaction.followUp("No results found.");

    const next_song = result.tracks[0];
    queue.insert(next_song);

    await interaction.followUp({
      embeds: [
        new EmbedBuilder().setDescription(
          `Added **[${next_song.title}](${next_song.url})** to the top of the queue.`
        ),
      ],
    });
  },
};
